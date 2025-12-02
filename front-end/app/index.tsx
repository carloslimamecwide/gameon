import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../contexts/auth-context";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      // Não redirecionar se estiver na página de reset-password
      const currentPath = segments.join("/");
      if (currentPath.includes("reset-password")) {
        return;
      }

      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/signin");
      }
    }
  }, [user, isLoading, router, segments]);

  // Show loading screen while checking authentication
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>⚽</Text>
      <Text style={styles.appName}>FootMatch</Text>
      <Text style={styles.loading}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  loading: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
