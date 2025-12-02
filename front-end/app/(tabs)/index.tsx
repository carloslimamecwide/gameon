import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth-context";
import { Colors, Spacing, Typography } from "../../constants/theme";

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Calcular padding inferior para permitir scroll completo
  const bottomPadding = Platform.OS === "ios" ? Math.max(insets.bottom + 80, 100) : Math.max(insets.bottom + 70, 80);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={[styles.content, { paddingBottom: bottomPadding }]}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bem-vindo ao FootMatch!</Text>
          <Text style={styles.subtitle}>Organize jogos de futebol com seus amigos</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>⚽</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Criar Jogo</Text>
              <Text style={styles.actionDescription}>Organize um novo jogo de futebol</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>👥</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Nova Equipa</Text>
              <Text style={styles.actionDescription}>Crie uma nova equipa e convide amigos</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📱</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Convidar Amigos</Text>
              <Text style={styles.actionDescription}>Partilhe via WhatsApp</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Ainda não há atividade recente</Text>
            <Text style={styles.emptyStateSubtext}>Comece criando uma equipa ou agendando um jogo!</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.sm,
  },
  welcomeSection: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  welcomeText: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  quickActions: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: Spacing.xs,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  recentActivity: {
    marginBottom: Spacing.lg,
  },
  emptyState: {
    padding: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  emptyStateText: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  emptyStateSubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
