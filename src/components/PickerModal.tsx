import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface PickerOption<T> {
  value: T;
  label: string;
}

interface PickerModalProps<T> {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: PickerOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T | null) => void;
  allowNull?: boolean;
  nullLabel?: string;
}

function PickerModal<T extends string | number>({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  allowNull = false,
  nullLabel = "All",
}: PickerModalProps<T>) {
  const { theme } = useTheme();

  const allOptions = allowNull
    ? [{ value: null as T | null, label: nullLabel }, ...options]
    : options;

  const handleSelect = (value: T | null) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[styles.content, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          <FlatList
            data={allOptions}
            keyExtractor={(item) =>
              item.value === null ? "null" : String(item.value)
            }
            renderItem={({ item }) => {
              const isSelected = selectedValue === item.value;
              return (
                <TouchableOpacity
                  style={[
                    styles.option,
                    isSelected && {
                      backgroundColor: theme.colors.primary + "20",
                    },
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: theme.colors.text },
                      isSelected && {
                        color: theme.colors.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default PickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    maxHeight: 300,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
    textAlign: "center",
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
