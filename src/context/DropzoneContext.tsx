import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DropzoneContextType, DropzoneProviderProps } from "../types/dropzone";

import { db } from "../config/firebase";
import { addDoc, collection, getDocs, query, updateDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "selectedDropzone";
const DEFAULT_DROPZONE = "EFOU";

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined,
);

export function DropzoneProvider({ children }: DropzoneProviderProps) {
  const [dropzone, setDropzoneState] = useState<string>(DEFAULT_DROPZONE);
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  

  useEffect(() => {

    //change this so that the dropzone is taken from firebase if logged in, 
  // otherwise from storage. If no dropzone is found in storage, 
  // use the local storage.
    const loadDropzone = async () => {
      try {

        if((!dropzone || dropzone === DEFAULT_DROPZONE) && user) {
          const dropzonesRef = collection(db, "users", user?.uid || "", "dropzones")
          const q = query(dropzonesRef)
          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {

            const dropzonesCurrent: string[] = []
            querySnapshot.docs.map((dz) => {
              dropzonesCurrent.push(dz.data().ICAO)
            })

            await AsyncStorage.setItem(STORAGE_KEY, dropzonesCurrent[0]);
          }
        }

        else {

          const stored = await AsyncStorage.getItem(STORAGE_KEY);
          if (stored) {
            setDropzoneState(stored);
          }
        }

        
      } catch (error) {
        console.error("Failed to load dropzone from storage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDropzone();
  }, []);

  
  const setDropzone = async (newDropzone: string) => {
    
    try {
      setDropzoneState(newDropzone);

      if (user) {
        // Save to Firebase
        const dropzonesRef = collection(db, "users", user.uid, "dropzones");
        const q = query(dropzonesRef)
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, { ICAO: newDropzone });
        } else {
          await addDoc(dropzonesRef, { ICAO: newDropzone });
        }
      }


      await AsyncStorage.setItem(STORAGE_KEY, newDropzone);
    } catch (error) {
      console.error("Failed to save dropzone to storage:", error);
    }
  };

  const value: DropzoneContextType = {
    dropzone,
    setDropzone,
    loading,
  };

  return (
    <DropzoneContext.Provider value={value}>
      {children}
    </DropzoneContext.Provider>
  );
}

export function useDropzone(): DropzoneContextType {
  const context = useContext(DropzoneContext);
  if (context === undefined) {
    throw new Error("useDropzone must be used within a DropzoneProvider");
  }
  return context;
}
