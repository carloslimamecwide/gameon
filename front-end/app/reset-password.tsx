import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { handleApiError } from "../utils/apiErrorHandler";
import GenericModal from "../components/GenericModal";
import { Colors, Spacing, Typography } from "../constants/theme";
import axios from "axios";
import { API_BASE_URL } from "../constants/api";

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Modal genérico
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState("");
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);

  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  // Regex para validação de senha
  const passwordRegex = {
    minLength: /.{6,}/, // Mínimo 6 caracteres
    hasNumber: /\d/, // Pelo menos um número
    hasLetter: /[a-zA-Z]/, // Pelo menos uma letra
  };

  useEffect(() => {
    if (!token) {
      showModal("Link inválido ou expirado. Solicite um novo link de recuperação.", "Erro", () => {
        router.replace("/signin");
      });
    }
  }, [token]);

  const showModal = (message: string, title?: string, onConfirm?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

  // Validar senha em tempo real
  const validatePassword = (pwd: string) => {
    const errors: string[] = [];

    if (!passwordRegex.minLength.test(pwd)) {
      errors.push("Mínimo 6 caracteres");
    }
    if (!passwordRegex.hasNumber.test(pwd)) {
      errors.push("Deve conter pelo menos um número");
    }
    if (!passwordRegex.hasLetter.test(pwd)) {
      errors.push("Deve conter pelo menos uma letra");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  // Atualizar validação quando senha muda
  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    if (text.length > 0) {
      validatePassword(text);
    } else {
      setPasswordErrors([]);
    }
  };

  const validateForm = () => {
    if (!newPassword.trim()) {
      showModal("Por favor, digite a nova palavra-passe", "Erro");
      return false;
    }

    if (!validatePassword(newPassword)) {
      showModal(`A senha deve atender aos seguintes requisitos:\n• ${passwordErrors.join("\n• ")}`, "Erro");
      return false;
    }

    if (!confirmPassword.trim()) {
      showModal("Por favor, confirme a nova palavra-passe", "Erro");
      return false;
    }

    if (newPassword !== confirmPassword) {
      showModal("As palavras-passe não coincidem. Verifique e tente novamente.", "Erro");
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword,
      });

      showModal("Palavra-passe redefinida com sucesso! Faça login com a sua nova senha.", "Sucesso", () => {
        router.replace("/signin");
      });
    } catch (error: any) {
      const apiMsg = handleApiError(error, "Erro ao redefinir senha. O link pode ter expirado.");
      showModal(apiMsg, "Erro");
      console.error("Erro ao redefinir senha:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignIn = () => {
    router.replace("/signin");
  };

  return (
    <>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>FootMatch</Text>
            <Text style={styles.appSubtitle}>🔐 Redefinir palavra-passe</Text>
          </View>

          {/* Reset Password Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Nova palavra-passe</Text>
            <Text style={styles.formDescription}>Digite a sua nova palavra-passe abaixo</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nova palavra-passe</Text>
              <TextInput
                style={[
                  styles.input,
                  newPassword.length > 0 && passwordErrors.length > 0 && styles.inputError,
                  newPassword.length > 0 && passwordErrors.length === 0 && styles.inputSuccess,
                ]}
                placeholder="Mínimo 6 caracteres, com letras e números"
                placeholderTextColor={Colors.textSecondary}
                value={newPassword}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {/* Indicadores de validação da senha */}
              {newPassword.length > 0 && (
                <View style={styles.passwordValidation}>
                  <View style={styles.validationItem}>
                    <Text
                      style={[
                        styles.validationText,
                        passwordRegex.minLength.test(newPassword) && styles.validationTextSuccess,
                      ]}
                    >
                      {passwordRegex.minLength.test(newPassword) ? "✅" : "❌"} Mínimo 6 caracteres
                    </Text>
                  </View>
                  <View style={styles.validationItem}>
                    <Text
                      style={[
                        styles.validationText,
                        passwordRegex.hasLetter.test(newPassword) && styles.validationTextSuccess,
                      ]}
                    >
                      {passwordRegex.hasLetter.test(newPassword) ? "✅" : "❌"} Pelo menos uma letra
                    </Text>
                  </View>
                  <View style={styles.validationItem}>
                    <Text
                      style={[
                        styles.validationText,
                        passwordRegex.hasNumber.test(newPassword) && styles.validationTextSuccess,
                      ]}
                    >
                      {passwordRegex.hasNumber.test(newPassword) ? "✅" : "❌"} Pelo menos um número
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar palavra-passe</Text>
              <TextInput
                style={[
                  styles.input,
                  confirmPassword.length > 0 && newPassword !== confirmPassword && styles.inputError,
                  confirmPassword.length > 0 &&
                    newPassword === confirmPassword &&
                    newPassword.length >= 6 &&
                    styles.inputSuccess,
                ]}
                placeholder="Digite novamente a palavra-passe"
                placeholderTextColor={Colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {/* Indicador de confirmação */}
              {confirmPassword.length > 0 && (
                <View style={styles.confirmationValidation}>
                  {newPassword === confirmPassword && newPassword.length >= 6 ? (
                    <Text style={[styles.validationText, styles.validationTextSuccess]}>✅ As senhas coincidem</Text>
                  ) : (
                    <Text style={styles.validationText}>❌ As senhas não coincidem</Text>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textOnPrimary} />
              ) : (
                <Text style={styles.resetButtonText}>Redefinir Senha</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Back to Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Lembrou-se da senha? </Text>
            <TouchableOpacity onPress={goToSignIn}>
              <Text style={styles.signInLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <GenericModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => {
          setModalVisible(false);
          setModalOnConfirm(undefined);
        }}
        onConfirm={modalOnConfirm}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  appTitle: {
    ...Typography.h1,
    color: Colors.textOnPrimary,
    marginBottom: Spacing.sm,
  },
  appSubtitle: {
    ...Typography.body,
    color: Colors.textOnPrimary,
    textAlign: "center",
    opacity: 0.9,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  formDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  inputContainer: {
    marginBottom: Spacing.sm,
  },
  inputLabel: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  input: {
    ...Typography.body,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    minHeight: 44,
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 2,
  },
  inputSuccess: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  passwordValidation: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  confirmationValidation: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  validationItem: {
    marginBottom: 2,
  },
  validationText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.error,
  },
  validationTextSuccess: {
    color: Colors.success,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: Spacing.sm,
    alignItems: "center",
    marginTop: Spacing.sm,
    minHeight: 44,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    ...Typography.body,
    color: Colors.textOnPrimary,
    opacity: 0.9,
  },
  signInLink: {
    ...Typography.body,
    color: Colors.textOnPrimary,
    fontWeight: "700" as const,
    textDecorationLine: "underline" as const,
  },
});
