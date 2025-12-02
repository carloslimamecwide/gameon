import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Colors, Spacing, Typography } from "../constants/theme";

interface GenericModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
  cancelText?: string;
  onCancel?: () => void;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
  onInputChange?: (text: string) => void;
  inputKeyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const GenericModal: React.FC<GenericModalProps> = ({
  visible,
  title,
  message,
  onClose,
  confirmText = "OK",
  onConfirm,
  cancelText,
  onCancel,
  showInput = false,
  inputPlaceholder = "",
  inputValue = "",
  onInputChange,
  inputKeyboardType = "default",
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          {showInput && (
            <TextInput
              style={styles.input}
              placeholder={inputPlaceholder}
              placeholderTextColor={Colors.textSecondary}
              value={inputValue}
              onChangeText={onInputChange}
              keyboardType={inputKeyboardType}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          <View style={styles.buttonRow}>
            {cancelText && (
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel || onClose}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm || onClose}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ...existing code...

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    minWidth: 280,
    maxWidth: "85%",
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  message: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: "center",
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
    width: "100%",
    marginBottom: Spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  button: {
    borderRadius: 8,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginLeft: Spacing.sm,
    minWidth: 80,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  confirmButtonText: {
    color: Colors.textOnPrimary,
    ...Typography.button,
  },
  cancelButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
    ...Typography.button,
  },
});

export default GenericModal;
