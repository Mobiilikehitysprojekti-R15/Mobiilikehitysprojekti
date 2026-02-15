import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { JumpData } from "../types/jumpDataFirebase";

interface JumpCardProps {
  jump: JumpData;
  buttonLabel?: string;
  showHeader?: boolean;
  headerTitle?: string;
}

const JumpCard = ({ 
  jump, 
  buttonLabel = "Go to jump info",
  showHeader = false,
  headerTitle = "Jump"
}: JumpCardProps) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handlePress = () => {
    navigation.navigate("JumpInfo" as never, { jump } as never);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {showHeader && (
        <View style={styles.headerRow}>
          <Ionicons 
            name="arrow-forward" 
            size={24} 
            color={theme.colors.text} 
            style={[styles.icon, styles.headerIcon]} 
          />
          <Text style={[styles.header, { color: theme.colors.text }]}>
            {headerTitle}
          </Text>
        </View>
      )}

      <View style={styles.dataContainer}>
        <View style={styles.dataRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Date:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {formatDate(jump.jumpDate)}
          </Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>At:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {jump.dropzone || "N/A"}
          </Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Alt:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {jump.altitude ?? "N/A"} m
          </Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Type:</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>
            {jump.releaseType === "Static line" ? "Staticline" : "Freefall"}
          </Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Status:</Text>
          <Text style={[styles.value, { color: jump.isAccepted ? theme.colors.primary : theme.colors.textSecondary }]}>
            {jump.isAccepted ? "Accepted" : "Pending"}
          </Text>
        </View>
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handlePress}
      >
        <Text style={[styles.buttonText, { color: theme.colors.background }]}>
          {buttonLabel}
        </Text>
      </Pressable>
    </View>
  );
};

export default JumpCard;

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
  dataContainer: {
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    width: 50,
  },
  value: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
});
