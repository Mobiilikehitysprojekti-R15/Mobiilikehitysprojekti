import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../config/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { JumpData } from "../types/jumpDataFirebase";
import JumpCard from "./JumpCard";

const LatestSkydive = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [latestJump, setLatestJump] = useState<JumpData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestJump = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const jumpsRef = collection(db, "users", user.uid, "jumps");
        const q = query(jumpsRef, orderBy("jumpNumber", "desc"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0].data();
          setLatestJump({
            jumpNumber: doc.jumpNumber,
            jumpDate: doc.jumpDate,
            dropzone: doc.dropzone || "",
            plane: doc.plane || "",
            altitude: doc.altitude ?? null,
            canopy: doc.canopy || "",
            releaseType: doc.releaseType || "Static line",
            isAccepted: doc.isAccepted ?? false,
            freefallTime: doc.freefallTime ?? null,
            notes: doc.notes || "",
            createdAt: doc.createdAt || "",
          });
        }
      } catch (error) {
        console.error("Error fetching latest jump:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJump();
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerRow}>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.text} style={[styles.icon, styles.headerIcon]} />
                    <Text style={[styles.header, { color: theme.colors.text }]}>Latest skydive</Text>
        </View>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Loading...</Text>
      </View>
    );
  }

  // Not signed in state
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerRow}>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.text} style={[styles.icon, styles.headerIcon]} />
                    <Text style={[styles.header, { color: theme.colors.text }]}>Latest skydive</Text>
        </View>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>Sign in to see your latest jump</Text>
      </View>
    );
  }

  // No jumps state
  if (!latestJump) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerRow}>
                    <Ionicons name="arrow-forward" size={24} color={theme.colors.text} style={[styles.icon, styles.headerIcon]} />
                    <Text style={[styles.header, { color: theme.colors.text }]}>Latest skydive</Text>
        </View>
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>No jumps logged yet</Text>
      </View>
    );
  }

  return (
    <JumpCard
      jump={latestJump}
      showHeader
      headerTitle="Latest skydive"
    />
  );
};

export default LatestSkydive;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  headerIcon: {
    transform: [{ rotate: "45deg" }],
  },
  header: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  infoText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
