import { Tabs, useRouter, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { Text, View, StyleSheet, Animated, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth-context";
import { Colors, Spacing } from "../../constants/theme";

// Componente melhorado para ícones customizados da tab bar
const TabIcon = ({ name, color, focused }: { name: string; color: string; focused: boolean }) => {
  const scaleValue = new Animated.Value(focused ? 1.1 : 1);

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.1 : 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleValue]);

  const getIcon = () => {
    switch (name) {
      case "home":
        return focused ? "🏠" : "🏡";
      case "teams":
        return focused ? "👥" : "👤";
      case "fields":
        return focused ? "🏟️" : "🥅";
      case "games":
        return focused ? "⚽" : "🏈";
      case "profile":
        return focused ? "👤" : "👤";
      default:
        return "📱";
    }
  };

  const getIconBackground = () => {
    if (!focused) return "transparent";
    switch (name) {
      case "home":
        return Colors.primaryLight;
      case "teams":
        return Colors.primaryLight;
      case "fields":
        return Colors.success + "20"; // Green with opacity
      case "games":
        return Colors.accent + "20"; // Orange with opacity
      case "profile":
        return Colors.secondary + "20"; // Blue with opacity
      default:
        return Colors.primaryLight;
    }
  };

  return (
    <Animated.View
      style={[
        styles.tabIconContainer,
        {
          backgroundColor: getIconBackground(),
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.6 }]}>{getIcon()}</Text>
      {focused && <View style={styles.focusIndicator} />}
    </Animated.View>
  );
};

export default function TabLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Garantir valores mínimos para safe area
  const safeBottomPadding = Platform.OS === "android" ? Math.max(insets.bottom + 6, 12) : Math.max(insets.bottom, 8);

  const tabHeight = Platform.OS === "android" ? 70 + Math.max(insets.bottom, 0) : 75 + Math.max(insets.bottom - 8, 0);

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/signin" && pathname !== "/signup" && pathname !== "/reset-password") {
      router.replace("/signin");
    }
  }, [user, isLoading, pathname]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.tabInactive,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: Colors.textOnPrimary,
        },
        headerTintColor: Colors.textOnPrimary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
          paddingBottom: safeBottomPadding,
          paddingTop: 8,
          height: tabHeight,
          elevation: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
          marginBottom: 1,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: `Olá, ${user?.name || "Visitante"}! ⚽`,
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => <TabIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="teams"
        options={{
          title: "Equipas",
          headerTitle: "Minhas Equipas",
          tabBarLabel: "Equipas",
          tabBarIcon: ({ focused, color }) => <TabIcon name="teams" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="fields"
        options={{
          title: "Campos",
          headerTitle: "Campos Próximos",
          tabBarLabel: "Campos",
          tabBarIcon: ({ focused, color }) => <TabIcon name="fields" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: "Jogos",
          headerTitle: "Calendário de Jogos",
          tabBarLabel: "Jogos",
          tabBarIcon: ({ focused, color }) => <TabIcon name="games" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerTitle: "Meu Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused, color }) => <TabIcon name="profile" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: 16,
    position: "relative",
    marginBottom: 1,
  },
  tabIconContainerFocused: {
    backgroundColor: Colors.primaryLight,
    transform: [{ scale: 1.1 }],
  },
  tabIcon: {
    fontSize: 18,
    textAlign: "center",
  },
  tabIconFocused: {
    fontSize: 20,
  },
  focusIndicator: {
    position: "absolute",
    bottom: -6,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});
