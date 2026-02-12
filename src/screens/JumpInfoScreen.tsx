import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { JumpData } from "../types/jumpDataFirebase";

type JumpInfoRouteParams = {
  JumpInfo: {
    jump: JumpData;
  };
};

const JumpInfoScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<RouteProp<JumpInfoRouteParams, "JumpInfo">>();
  const { jump } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const InfoRow = ({ label, value, valueColor }: { label: string; value: string | number | null; valueColor?: string }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor || theme.colors.text }]}>
        {value ?? "N/A"}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >

      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <InfoRow label="Jump Number" value={jump.jumpNumber} />
        <InfoRow label="Date" value={formatDate(jump.jumpDate)} />
        <InfoRow label="Dropzone" value={jump.dropzone} />
        <InfoRow label="Plane" value={jump.plane} />
        <InfoRow label="Altitude" value={jump.altitude ? `${jump.altitude} m` : null} />
        <InfoRow label="Canopy" value={jump.canopy} />
        <InfoRow 
          label="Type" 
          value={jump.releaseType === "Static line" ? "Static Line" : "Free Fall"} 
        />
        <InfoRow 
          label="Freefall Time" 
          value={jump.freefallTime ? `${jump.freefallTime} sec` : null} 
        />
        <InfoRow 
          label="Status" 
          value={jump.isAccepted ? "Accepted" : "Pending"}
          valueColor={jump.isAccepted ? theme.colors.primary : theme.colors.textSecondary}
        />
      </View>

      {jump.notes && (
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.notesLabel, { color: theme.colors.textSecondary }]}>
            Notes
          </Text>
          <Text style={[styles.notesText, { color: theme.colors.text }]}>
            {jump.notes}
          </Text>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

export default JumpInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
  },
  label: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  value: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  notesLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  notesText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
