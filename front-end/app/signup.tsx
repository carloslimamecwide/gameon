import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import GenericModal from "../components/GenericModal";
import { useRouter } from "expo-router";
import { registerUser } from "../services/auth/auth";
import { handleApiError } from "../utils/apiErrorHandler";
import { Colors, Spacing, Typography } from "../constants/theme";

interface RegistrationResponse {
  message: string;
  userId: number;
  emailSent: boolean;
}

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Modal genérico
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
  const [modalMessage, setModalMessage] = useState("");
  const [modalOnConfirm, setModalOnConfirm] = useState<(() => void) | undefined>(undefined);

  const router = useRouter();

  // Regex para validação de senha
  const passwordRegex = {
    minLength: /.{6,}/, // Mínimo 6 caracteres
    hasNumber: /\d/, // Pelo menos um número
    hasLetter: /[a-zA-Z]/, // Pelo menos uma letra
  };

  // Regex para validação de email (RFC 5322 simplificado)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

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
    setPassword(text);
    if (text.length > 0) {
      validatePassword(text);
    } else {
      setPasswordErrors([]);
    }
  };

  const showModal = (message: string, title?: string, onConfirm?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

  const validateForm = () => {
    // Validar nome
    if (!name.trim()) {
      showModal("Por favor, digite o seu nome", "Erro");
      return false;
    }

    if (name.trim().length < 2) {
      showModal("Nome deve ter pelo menos 2 caracteres", "Erro");
      return false;
    }

    // Validar email
    const emailValue = email.trim();
    if (!emailValue) {
      showModal("Por favor, digite o seu email", "Erro");
      return false;
    }
    if (emailValue.includes(" ")) {
      showModal("O email não pode conter espaços.", "Erro");
      return false;
    }
    if (!emailRegex.test(emailValue)) {
      showModal("Por favor, digite um email válido (exemplo: nome@dominio.com)", "Erro");
      return false;
    }

    // Validar senha com regex
    if (!password.trim()) {
      showModal("Por favor, digite uma palavra-passe", "Erro");
      return false;
    }

    if (!validatePassword(password)) {
      showModal(`A senha deve atender aos seguintes requisitos:\n• ${passwordErrors.join("\n• ")}`, "Erro");
      return false;
    }

    // Validar confirmação de senha
    if (!confirmPassword.trim()) {
      showModal("Por favor, confirme a sua palavra-passe", "Erro");
      return false;
    }

    if (password !== confirmPassword) {
      showModal("As palavras-passe não coincidem. Verifique e tente novamente.", "Erro");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = (await registerUser(name.trim(), email.trim(), password)) as RegistrationResponse;

      if (!response || !response.userId || !response.emailSent) {
        throw new Error("Falha no registro. Tente novamente.");
      }

      showModal(
        "Conta criada com sucesso!\n\nVerifique o seu email para ativar a conta antes de fazer login.",
        "Conta Criada!",
        () => {
          setModalVisible(false);
          router.replace("/signin");
        }
      );
    } catch (error: any) {
      const apiMsg = handleApiError(error, "Erro ao criar conta. Verifique os dados e tente novamente.");
      showModal(apiMsg, "Erro");
      console.error("Erro no registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignIn = () => {
    router.push("/signin");
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>FootMatch</Text>
            <Text style={styles.appSubtitle}>⚽ Junte-se à nossa comunidade</Text>
          </View>

          {/* Sign Up Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Criar nova conta</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o seu nome"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

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
                style={[
                  styles.input,
                  password.length > 0 && passwordErrors.length > 0 && styles.inputError,
                  password.length > 0 && passwordErrors.length === 0 && styles.inputSuccess,
                ]}
                placeholder="Mínimo 6 caracteres, com letras e números"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {/* Indicadores de validação da senha */}
              {password.length > 0 && (
                <View style={styles.passwordValidation}>
                  <View style={styles.validationItem}>
                    <Text
                      style={[
                        styles.validationText,
                        passwordRegex.minLength.test(password) && styles.validationTextSuccess,
                      ]}
                    >
                      {passwordRegex.minLength.test(password) ? "✅" : "❌"} Mínimo 6 caracteres
                    </Text>
                  </View>
                  <View style={styles.validationItem}>
                    <Text
                      style={[
                        styles.validationText,
                        passwordRegex.hasLetter.test(password) && styles.validationTextSuccess,
                      ]}
                    >
                      {passwordRegex.hasLetter.test(password) ? "✅" : "❌"} Pelo menos uma letra
                    </Text>
                  </View>
                  <View style={styles.validationItem}>
                    <Text
                      style={[
                        styles.validationText,
                        passwordRegex.hasNumber.test(password) && styles.validationTextSuccess,
                      ]}
                    >
                      {passwordRegex.hasNumber.test(password) ? "✅" : "❌"} Pelo menos um número
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
                  confirmPassword.length > 0 && password !== confirmPassword && styles.inputError,
                  confirmPassword.length > 0 &&
                    password === confirmPassword &&
                    password.length >= 6 &&
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
                  {password === confirmPassword && password.length >= 6 ? (
                    <Text style={[styles.validationText, styles.validationTextSuccess]}>✅ As senhas coincidem</Text>
                  ) : (
                    <Text style={styles.validationText}>❌ As senhas não coincidem</Text>
                  )}
                </View>
              )}
            </View>

            {/* Exibir erro visualmente abaixo do formulário */}
            {/* Os erros agora são exibidos no modal genérico */}

            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.textOnPrimary} />
              ) : (
                <Text style={styles.signUpButtonText}>Criar Conta</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            Ao criar uma conta, aceita os nossos <Text style={styles.termsLink}>Termos de Serviço</Text> e{" "}
            <Text style={styles.termsLink}>Política de Privacidade</Text>
          </Text>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={goToSignIn}>
              <Text style={styles.signInLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Modal Genérico */}
      <GenericModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
        onConfirm={modalOnConfirm}
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
  signUpButton: {
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
  signUpButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  termsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: "600",
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
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  signInLink: {
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
