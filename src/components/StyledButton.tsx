import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

type ButtonVariant = "filled" | "outline";

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  buttonStyle?: ViewStyle;
  variant?: ButtonVariant;
}

const StyledButton = ({
  title,
  loading = false,
  disabled,
  buttonStyle,
  style,
  variant = "filled",
  ...props
}: StyledButtonProps) => {
  const { theme } = useTheme();
  const isFilled = variant === "filled";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        { backgroundColor: isFilled ? theme.colors.primary : theme.colors.background },
        { borderColor: isFilled ? theme.colors.primary : theme.colors.border },
        buttonStyle,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? theme.colors.background : theme.colors.primary} />
      ) : (
        <Text style={[styles.buttonText, { color: isFilled ? theme.colors.background : theme.colors.primary }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default StyledButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderWidth: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
