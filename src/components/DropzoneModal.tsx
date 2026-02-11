import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DropzoneModalProps, DROPZONES, dropzoneType } from "../types/dropzone";
import { useDropzone } from "../context/DropzoneContext";
import { useTheme } from "../context/ThemeContext";
import {db} from "../config/firebase";
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";

const DropzoneModal = ({ visible, onClose }: DropzoneModalProps) => {
  const { dropzone, setDropzone } = useDropzone();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const [dropZones, setDropZones] = useState<dropzoneType[] | null>(null)

  useEffect(() => {
    /*const query = searchQuery.toLowerCase().trim();
    if (!query) return DROPZONES;
    return DROPZONES.filter(
      (dz) =>
        dz.code.toLowerCase().includes(query) ||
        dz.name.toLowerCase().includes(query),
    );*/

    const getZones = async () => {
      try {
        const dropzonesRef = collection(db, "dropzones")
        const q = query(dropzonesRef)
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {

          const dropzonesCurrent: dropzoneType[] = []

          querySnapshot.docs.map((dz) => {
            const current = {
              ICAO: dz.data().ICAO,
              name: dz.data().name,
              country: dz.data().country
            }
            dropzonesCurrent.push(current)
          })

          if (searchQuery !== "") {

            dropzonesCurrent.filter(dz =>
              dz.name.toLowerCase().includes(searchQuery) ||
              dz.ICAO.toLowerCase().includes(searchQuery) ||
              dz.country.toLowerCase().includes(searchQuery)
            )
          }


          setDropZones(dropzonesCurrent)

        }
      }
      catch {
        console.log("dropzones cant be found")
      }
    }

    getZones()

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
    const current = dropZones?.find((dz) => dz.ICAO === dropzone);
    return current ? `${current.ICAO} - ${current.name}` : dropzone;
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
            {dropZones?.map((dz) => (
              <Pressable
                key={dz.ICAO}
                style={[
                  styles.dropzoneItem,
                  { backgroundColor: theme.colors.surface },
                  dropzone === dz.ICAO && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => handleSelect(dz.ICAO)}
              >
                <Text
                  style={[
                    styles.dropzoneCode,
                    { color: theme.colors.text },
                    dropzone === dz.ICAO && { color: theme.colors.background },
                  ]}
                >
                  {dz.ICAO}
                </Text>
                <Text
                  style={[
                    styles.dropzoneName,
                    { color: theme.colors.textSecondary },
                    dropzone === dz.ICAO && { color: theme.colors.background },
                  ]}
                >
                  {dz.name}
                </Text>
              </Pressable>
            ))}
            {dropZones?.length === 0 && (
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

