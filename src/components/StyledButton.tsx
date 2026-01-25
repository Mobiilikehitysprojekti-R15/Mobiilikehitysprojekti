import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

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
  const isFilled = variant === "filled";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isFilled ? styles.buttonFilled : styles.buttonOutline,
        (disabled || loading) && styles.buttonDisabled,
        buttonStyle,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? "#fff" : "#000"} />
      ) : (
        <Text style={[styles.buttonText, isFilled ? styles.textFilled : styles.textOutline]}>
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
  },
  buttonFilled: {
    backgroundColor: "#000",
  },
  buttonOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  textFilled: {
    color: "#fff",
  },
  textOutline: {
    color: "#000",
  },
});
