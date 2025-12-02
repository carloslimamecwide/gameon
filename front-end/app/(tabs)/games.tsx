import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { Calendar } from "react-native-calendars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing, Typography } from "../../constants/theme";

export default function GamesScreen() {
  const insets = useSafeAreaInsets();

  const bottomPadding = Platform.OS === "ios" ? Math.max(insets.bottom + 100, 120) : Math.max(insets.bottom + 80, 90);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPadding }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📅 Calendário de Jogos</Text>
          <Text style={styles.headerSubtitle}>Organize e acompanhe seus jogos de futebol</Text>
        </View>

        <View style={styles.calendarCard}>
          <Calendar
            theme={{
              backgroundColor: Colors.surface,
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.text,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.textOnPrimary,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.textSecondary,
              arrowColor: Colors.primary,
              monthTextColor: Colors.text,
            }}
          />
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>⚽ Ações Rápidas</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => Alert.alert("Em breve", "Funcionalidade em desenvolvimento!")}
          >
            <Text style={styles.createButtonText}>+ Criar Novo Jogo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  calendarCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.sm,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  actionsCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionsTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  createButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: Spacing.sm,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  createButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});
