import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useDropzone } from "../context/DropzoneContext";
import DropzoneModal from "./DropzoneModal";
import { DROPZONES, dropzoneType } from "../types/dropzone";
import {db} from "../config/firebase";
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";

const YourDropzone = () => {
  const { dropzone, loading } = useDropzone();
  const [modalVisible, setModalVisible] = useState(false);

  const [currentDropZone, setCurrentDropZone] = useState<string>("test")

  useEffect(() => {

    const getDropzoneName = async () => {
      //const dz = DROPZONES.find((d) => d.ICAO === dropzone);

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

          const dz = dropzonesCurrent.find(d =>
            d.ICAO === dropzone
          )
          setCurrentDropZone(dz ? dz.name : dropzone)

        }
        else {
          console.log("collection is empy")
        }
      }
      catch {
        const dz = DROPZONES.find((d) => d.ICAO === dropzone)

        setCurrentDropZone(dz ? dz.name : dropzone)
      }
    }

    getDropzoneName()


  }, [dropzone])



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
        {dropzone} - {currentDropZone}
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
