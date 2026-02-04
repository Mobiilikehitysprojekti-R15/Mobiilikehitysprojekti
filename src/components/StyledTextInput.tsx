import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface StyledTextInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

const StyledTextInput = ({
  label,
  containerStyle,
  inputStyle,
  style,
  placeholder,
  ...props
}: StyledTextInputProps) => {
  const { theme } = useTheme();
  const resolvedPlaceholder =
    placeholder ?? (label ? `Enter ${label.toLowerCase()}` : undefined);

  return (
    <View style={containerStyle}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, backgroundColor: theme.colors.background, color: theme.colors.text }, inputStyle, style]}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
    </View>
  );
};

export default StyledTextInput;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
    fontFamily: "Inter_400Regular",
  },
  input: {
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontFamily: "Inter_300Light",
    textAlignVertical: "center",
  },
});
