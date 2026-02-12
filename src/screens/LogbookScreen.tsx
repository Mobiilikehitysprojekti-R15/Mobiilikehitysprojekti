import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { JumpData } from "../types/jumpDataFirebase";
import JumpsListScrollView from "../components/JumpsListScrollView";

const LogbookScreen = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [jumps, setJumps] = useState<JumpData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJumps = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const jumpsRef = collection(db, "users", user.uid, "jumps");
        const q = query(jumpsRef, orderBy("jumpDate", "desc"));
        const snapshot = await getDocs(q);

        const jumpData: JumpData[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as JumpData[];

        setJumps(jumpData);
      } catch (error) {
        console.error("Error fetching jumps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJumps();
  }, [user]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[styles.loadingText, { color: theme.colors.textSecondary }]}
        >
          Loading logbook...
        </Text>
      </View>
    );
  }

  if (jumps.length === 0) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.noDataText, { color: theme.colors.text }]}>
          No jumps logged yet
        </Text>
        <Text
          style={[styles.noDataSubtext, { color: theme.colors.textSecondary }]}
        >
          Add jumps in the "New" tab to start your logbook
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Logbook
      </Text>
      <Text style={[styles.subheader, { color: theme.colors.textSecondary }]}>
        Total jumps: {jumps.length}
      </Text>

      <JumpsListScrollView jumps={jumps} title="All Jumps" />

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default LogbookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  noDataText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  noDataSubtext: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  bottomSpacer: {
    height: 40,
  },
});