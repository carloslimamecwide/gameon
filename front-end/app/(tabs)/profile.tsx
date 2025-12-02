import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/auth-context";
import { Colors, Spacing, Typography } from "../../constants/theme";
import GenericModal from "../../components/GenericModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../constants/api";
import { handleApiError } from "../../utils/apiErrorHandler";

export default function ProfileScreen() {
  const { user, clearAuth, saveAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedPhone, setEditedPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  console.log("Rendering ProfileScreen for user:", JSON.stringify(user));
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState("");
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(undefined);

  const insets = useSafeAreaInsets();

  // Calcular padding inferior para permitir scroll completo
  const bottomPadding =
    Platform.OS === "ios"
      ? Math.max(insets.bottom + 120, 140) // Mais espaço para iOS garantir visibilidade do botão
      : Math.max(insets.bottom + 80, 90);

  const showModal = (message: string, title?: string, onConfirm?: () => void, cancelText?: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOnConfirm(() => onConfirm);
    setModalCancelText(cancelText);
    setModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      showModal("Por favor, digite o seu nome", "Erro");
      return;
    }

    setIsLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem("access_token");
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (!accessToken) {
        showModal("Sessão expirada. Faça login novamente.", "Erro");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        {
          name: editedName.trim(),
          phone: editedPhone.trim() || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Atualizar contexto com novo nome e telefone
      if (user) {
        await saveAuth(
          {
            ...user,
            name: editedName.trim(),
            phone: editedPhone.trim() || undefined,
          },
          accessToken,
          refreshToken || ""
        );
      }

      setIsEditing(false);
      showModal("Perfil atualizado com sucesso!", "Sucesso");
    } catch (error: any) {
      const apiMsg = handleApiError(error, "Erro ao atualizar perfil. Tente novamente.");
      showModal(apiMsg, "Erro");
      console.error("Erro ao atualizar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    showModal(
      "Tem certeza que deseja sair da sua conta?",
      "Sair",
      () => {
        setModalVisible(false);
        clearAuth();
      },
      "Cancelar"
    );
  };

  const stats = [
    { label: "Equipas", value: "0", icon: "👥" },
    { label: "Jogos", value: "0", icon: "⚽" },
    { label: "Vitórias", value: "0", icon: "🏆" },
    { label: "Amigos", value: "0", icon: "👋" },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: bottomPadding }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      alwaysBounceVertical={Platform.OS === "ios"}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || "U"}</Text>
          </View>
          <View style={styles.profileInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Seu nome"
                placeholderTextColor={Colors.textSecondary}
              />
            ) : (
              <Text style={styles.userName}>{user?.name}</Text>
            )}
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
              }
            }}
          >
            <Text style={styles.editButtonText}>{isEditing ? "Salvar" : "Editar"}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Informações</Text>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nome</Text>
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Seu nome completo"
                placeholderTextColor={Colors.textSecondary}
              />
            ) : (
              <Text style={styles.detailValue}>{user?.name}</Text>
            )}
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{user?.email}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Telefone</Text>
            {isEditing ? (
              <TextInput
                style={styles.detailInput}
                value={editedPhone}
                onChangeText={setEditedPhone}
                placeholder="Seu número de telefone"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.detailValue}>{editedPhone || "Não informado"}</Text>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>🔔</Text>
            <Text style={styles.actionText}>Notificações</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionText}>Partilhar App</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>❓</Text>
            <Text style={styles.actionText}>Ajuda & Suporte</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>

      <GenericModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => {
          setModalVisible(false);
          setModalOnConfirm(undefined);
          setModalCancelText(undefined);
        }}
        onConfirm={modalOnConfirm}
        cancelText={modalCancelText}
      />
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  avatarText: {
    ...Typography.h2,
    color: Colors.textOnPrimary,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  nameInput: {
    ...Typography.subtitle,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  editButtonText: {
    ...Typography.caption,
    color: Colors.textOnPrimary,
    fontWeight: "600",
  },
  statsContainer: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.sm,
    alignItems: "center",
    marginHorizontal: Spacing.xs,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: Spacing.xs,
  },
  statValue: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  detailsContainer: {
    marginBottom: Spacing.lg,
  },
  detailItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: "600",
  },
  detailValue: {
    ...Typography.body,
    color: Colors.text,
  },
  detailInput: {
    ...Typography.body,
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.xs,
  },
  actionsContainer: {
    marginBottom: Spacing.lg,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: Spacing.md,
  },
  actionText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  actionArrow: {
    ...Typography.h3,
    color: Colors.textSecondary,
  },
  signOutButton: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? Spacing.xl * 2 : Spacing.xl,
    marginTop: Spacing.md,
  },
  signOutText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});
