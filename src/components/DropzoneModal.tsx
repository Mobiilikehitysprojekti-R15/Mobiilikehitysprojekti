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

const DropzoneModal = ({ visible, onClose }: DropzoneModalProps) => {
  const { dropzone, setDropzone } = useDropzone();
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
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change dropzone</Text>
          <Text style={styles.currentDropzone}>{getCurrentDropzoneName()}</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search dropzones..."
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
                  dropzone === dz.code && styles.dropzoneItemSelected,
                ]}
                onPress={() => handleSelect(dz.code)}
              >
                <Text
                  style={[
                    styles.dropzoneCode,
                    dropzone === dz.code && styles.dropzoneTextSelected,
                  ]}
                >
                  {dz.code}
                </Text>
                <Text
                  style={[
                    styles.dropzoneName,
                    dropzone === dz.code && styles.dropzoneTextSelected,
                  ]}
                >
                  {dz.name}
                </Text>
              </Pressable>
            ))}
            {filteredDropzones.length === 0 && (
              <Text style={styles.noResults}>No dropzones found</Text>
            )}
          </ScrollView>

          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: "white",
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
    color: "#666",
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
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
    backgroundColor: "#f5f5f5",
  },
  dropzoneItemSelected: {
    backgroundColor: "#000",
  },
  dropzoneCode: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#000",
  },
  dropzoneName: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#666",
    marginTop: 2,
  },
  dropzoneTextSelected: {
    color: "#fff",
  },
  noResults: {
    textAlign: "center",
    color: "#666",
    fontFamily: "Inter_400Regular",
    padding: 20,
  },
  closeButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
