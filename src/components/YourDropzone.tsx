import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useDropzone } from "../context/DropzoneContext";
import { DROPZONES } from "../types/dropzone";
import DropzoneModal from "./DropzoneModal";

const YourDropzone = () => {
  const { dropzone, loading } = useDropzone();
  const [modalVisible, setModalVisible] = useState(false);

  const getDropzoneName = () => {
    const dz = DROPZONES.find((d) => d.code === dropzone);
    return dz ? dz.name : dropzone;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Your dropzone</Text>
        <Text style={styles.dropzoneText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your dropzone</Text>
      <Text style={styles.dropzoneText}>
        {dropzone} - {getDropzoneName()}
      </Text>
      <Pressable
        style={styles.changeButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.changeButtonText}>Change</Text>
      </Pressable>

      <DropzoneModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default YourDropzone;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  dropzoneText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#333",
    marginBottom: 12,
  },
  changeButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
