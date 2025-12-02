import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { createTeam, fetchUserTeams } from "../../services/team/teams";

interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdBy: string;
  createdAt: Date;
}

export default function TeamsScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  // Carregar equipas da API
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const userTeams = (await fetchUserTeams()) as Team[];
        setTeams(userTeams);
      } catch (error) {
        console.error("Erro ao carregar equipas:", error);
      }
    };

    if (user) {
      loadTeams();
    }
  }, [user]);

  // Calcular padding inferior para permitir scroll completo
  const bottomPadding = Platform.OS === "ios" ? Math.max(insets.bottom + 80, 100) : Math.max(insets.bottom + 70, 80);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para a equipa");
      return;
    }

    try {
      // Usar API real para criar equipa
      const newTeam = (await createTeam(newTeamName.trim(), newTeamDescription.trim())) as Team;

      // Atualizar lista de equipas
      setTeams((prev) => [newTeam, ...prev]);
      setNewTeamName("");
      setNewTeamDescription("");
      setShowCreateModal(false);

      Alert.alert("Sucesso", "Equipa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar equipa:", error);
      Alert.alert("Erro", "Falha ao criar equipa. Tente novamente.");
    }
  };

  const handleInviteToWhatsApp = (team: Team) => {
    Alert.alert("Convidar Amigos", `Convide seus amigos para a equipa "${team.name}" via WhatsApp`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Partilhar", onPress: () => console.log("Share team via WhatsApp") },
    ]);
  };

  const renderTeamCard = (team: Team) => (
    <View key={team.id} style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamName}>{team.name}</Text>
        <View style={styles.membersCount}>
          <Text style={styles.membersCountText}>{team.members.length}</Text>
        </View>
      </View>

      {team.description ? <Text style={styles.teamDescription}>{team.description}</Text> : null}

      <View style={styles.teamFooter}>
        <Text style={styles.createdBy}>Criada por {team.createdBy === user?.email ? "você" : team.createdBy}</Text>

        <TouchableOpacity style={styles.inviteButton} onPress={() => handleInviteToWhatsApp(team)}>
          <Text style={styles.inviteButtonText}>📱 Convidar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={[styles.content, { paddingBottom: bottomPadding }]}>
          {teams.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>👥</Text>
              <Text style={styles.emptyStateTitle}>Nenhuma equipa ainda</Text>
              <Text style={styles.emptyStateDescription}>
                Crie sua primeira equipa para começar a organizar jogos de futebol
              </Text>
            </View>
          ) : (
            <View style={styles.teamsList}>{teams.map(renderTeamCard)}</View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
        <Text style={styles.createButtonText}>+ Nova Equipa</Text>
      </TouchableOpacity>

      <Modal visible={showCreateModal} animationType="slide" presentationStyle="formSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Equipa</Text>
            <TouchableOpacity onPress={handleCreateTeam}>
              <Text style={styles.modalSaveText}>Criar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Equipa</Text>
              <TextInput
                style={styles.textInput}
                value={newTeamName}
                onChangeText={setNewTeamName}
                placeholder="Ex: Amigos do Futebol"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição (opcional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newTeamDescription}
                onChangeText={setNewTeamDescription}
                placeholder="Descreva sua equipa..."
                placeholderTextColor={Colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  emptyStateTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptyStateDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
  teamsList: {
    gap: Spacing.sm,
  },
  teamCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.sm,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  teamName: {
    ...Typography.subtitle,
    color: Colors.text,
    flex: 1,
  },
  membersCount: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  membersCountText: {
    ...Typography.caption,
    color: Colors.textOnPrimary,
    fontWeight: "600",
  },
  teamDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  teamFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  createdBy: {
    ...Typography.caption,
    color: Colors.textSecondary,
    flex: 1,
  },
  inviteButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  inviteButtonText: {
    ...Typography.caption,
    color: Colors.textOnPrimary,
    fontWeight: "600",
  },
  createButton: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  createButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalCancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  modalTitle: {
    ...Typography.subtitle,
    color: Colors.text,
  },
  modalSaveText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
  modalContent: {
    padding: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.caption,
    color: Colors.text,
    marginBottom: Spacing.xs,
    fontWeight: "600",
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: Spacing.sm,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 40,
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
});
