import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useDropzone } from "../context/DropzoneContext";
import { useTheme } from "../context/ThemeContext";
import { DROPZONES } from "../types/dropzone";
import DropzoneModal from "./DropzoneModal";

const YourDropzone = () => {
  const { dropzone, loading } = useDropzone();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const getDropzoneName = () => {
    const dz = DROPZONES.find((d) => d.code === dropzone);
    return dz ? dz.name : dropzone;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Your dropzone</Text>
        <Text style={[styles.dropzoneText, { color: theme.colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Your dropzone</Text>
      <Text style={[styles.dropzoneText, { color: theme.colors.text }]}>
        {dropzone} - {getDropzoneName()}
      </Text>
      <Pressable
        style={[styles.changeButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.changeButtonText, { color: theme.colors.background }]}>Change</Text>
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
    marginBottom: 12,
  },
  changeButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  changeButtonText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});

