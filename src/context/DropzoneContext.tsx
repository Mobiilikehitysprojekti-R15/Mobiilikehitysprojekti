import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DropzoneContextType, DropzoneProviderProps } from "../types/dropzone";

const STORAGE_KEY = "selectedDropzone";
const DEFAULT_DROPZONE = "EFOU";

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined,
);

export function DropzoneProvider({ children }: DropzoneProviderProps) {
  const [dropzone, setDropzoneState] = useState<string>(DEFAULT_DROPZONE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDropzone = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setDropzoneState(stored);
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
