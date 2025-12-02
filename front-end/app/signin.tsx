import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/auth-context";
import { authenticateUser, forgotPassword } from "../services/auth/auth";
import { handleApiError } from "../utils/apiErrorHandler";
import GenericModal from "../components/GenericModal";
import { Colors, Spacing, Typography } from "../constants/theme";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  token: string;
}

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal genérico
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(undefined);

  const { saveAuth } = useAuth();
  const router = useRouter();

  const showModal = (message: string, title?: string, keepInputState: boolean = false) => {
    setModalTitle(title);
    setModalMessage(message);
    if (!keepInputState) {
      setShowEmailInput(false);
      setModalOnConfirm(undefined);
      setModalCancelText(undefined);
    }
    setModalVisible(true);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      showModal("Por favor, preencha todos os campos", "Erro");
      return;
    }

    setIsLoading(true);
    try {
      const response = (await authenticateUser(email.trim(), password)) as AuthResponse;

      if (!response || !response.accessToken || !response.refreshToken || !response.user) {
        showModal("Resposta inválida da API. Tente novamente.", "Erro");
        return;
      }

      const user = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      };

      await saveAuth(user, response.accessToken, response.refreshToken);
      router.replace("/(tabs)");
    } catch (error: any) {
      const apiMsg = handleApiError(error, "Erro ao autenticar. Tente novamente.");
      showModal(apiMsg, "Erro");
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setModalTitle("Recuperar palavra-passe");
    setModalMessage("Digite o seu email para receber instruções de recuperação:");
    setShowEmailInput(true);
    setModalCancelText("Cancelar");
    setModalVisible(true);
  };

  const handleForgotPasswordSubmit = async () => {
    const emailToSend = forgotPasswordEmail.trim();

    if (!emailToSend) {
      console.log("Email de recuperação vazio");
      return;
    }

    setIsLoading(true);
    setModalVisible(false);
    try {
      const response = (await forgotPassword(emailToSend)) as ForgotPasswordResponse;
      console.log("Forgot password response:", response);
      if (response && response.token) {
        // Redirecionar para a tela de reset com o token
        router.push(`/reset-password?token=${response.token}`);
      } else {
        showModal("Erro ao processar solicitação. Tente novamente.", "Erro");
      }
    } catch (error: any) {
      const apiMsg = handleApiError(error, "Erro ao verificar email. Tente novamente.");
      showModal(apiMsg, "Erro");
      console.error("Erro ao recuperar senha:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignUp = () => {
    router.push("/signup");
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>FootMatch</Text>
            <Text style={styles.appSubtitle}>⚽ Organize os seus jogos de futebol</Text>
          </View>

          {/* Sign In Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Entrar na sua conta</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o seu email"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Palavra-passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite a sua palavra-passe"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu a palavra-passe?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textOnPrimary} />
              ) : (
                <Text style={styles.signInButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Não tem conta? </Text>
            <TouchableOpacity onPress={goToSignUp}>
              <Text style={styles.signUpLink}>Criar conta</Text>
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
          setShowEmailInput(false);
          setModalOnConfirm(undefined);
          setModalCancelText(undefined);
        }}
        showInput={showEmailInput}
        inputPlaceholder="seu@email.com"
        inputValue={forgotPasswordEmail}
        onInputChange={setForgotPasswordEmail}
        inputKeyboardType="email-address"
        confirmText={showEmailInput ? "Enviar" : "OK"}
        onConfirm={showEmailInput ? handleForgotPasswordSubmit : modalOnConfirm}
        cancelText={modalCancelText}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
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
    color: Colors.primary,
    fontWeight: "bold",
    marginBottom: Spacing.sm,
  },
  appSubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  formTitle: {
    ...Typography.h3,
    color: Colors.text,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: Spacing.md,
  },
  forgotPasswordText: {
    ...Typography.caption,
    color: Colors.primary,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: Spacing.sm,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.sm,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  signUpLink: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
  errorContainer: {
    marginBottom: 8,
    backgroundColor: Colors.error + "11",
    borderRadius: 6,
    padding: 8,
    alignItems: "center",
  },
  errorText: {
    color: Colors.error,
    textAlign: "center",
    ...Typography.caption,
  },
});
