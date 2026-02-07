import React, { useState, useMemo } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DropzoneModalProps, DROPZONES } from "../types/dropzone";
import { useDropzone } from "../context/DropzoneContext";
import { useTheme } from "../context/ThemeContext";

const DropzoneModal = ({ visible, onClose }: DropzoneModalProps) => {
  const { dropzone, setDropzone } = useDropzone();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDropzones = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return DROPZONES;
    return DROPZONES.filter(
      (dz) =>
        dz.code.toLowerCase().includes(query) ||
        dz.name.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleSelect = (code: string) => {
    setDropzone(code);
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  const getCurrentDropzoneName = () => {
    const current = DROPZONES.find((dz) => dz.code === dropzone);
    return current ? `${current.code} - ${current.name}` : dropzone;
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Change dropzone</Text>
          <Text style={[styles.currentDropzone, { color: theme.colors.textSecondary }]}>{getCurrentDropzoneName()}</Text>

          <TextInput
            style={[
              styles.searchInput,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              }
            ]}
            placeholder="Search dropzones..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <ScrollView
            style={styles.dropzoneList}
            showsVerticalScrollIndicator={true}
          >
            {filteredDropzones.map((dz) => (
              <Pressable
                key={dz.code}
                style={[
                  styles.dropzoneItem,
                  { backgroundColor: theme.colors.surface },
                  dropzone === dz.code && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => handleSelect(dz.code)}
              >
                <Text
                  style={[
                    styles.dropzoneCode,
                    { color: theme.colors.text },
                    dropzone === dz.code && { color: theme.colors.background },
                  ]}
                >
                  {dz.code}
                </Text>
                <Text
                  style={[
                    styles.dropzoneName,
                    { color: theme.colors.textSecondary },
                    dropzone === dz.code && { color: theme.colors.background },
                  ]}
                >
                  {dz.name}
                </Text>
              </Pressable>
            ))}
            {filteredDropzones.length === 0 && (
              <Text style={[styles.noResults, { color: theme.colors.textSecondary }]}>No dropzones found</Text>
            )}
          </ScrollView>

          <Pressable
            style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleClose}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.background }]}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default DropzoneModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  currentDropzone: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 12,
  },
  dropzoneList: {
    maxHeight: 300,
  },
  dropzoneItem: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  dropzoneCode: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  dropzoneName: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  noResults: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    padding: 20,
  },
  closeButton: {
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});

