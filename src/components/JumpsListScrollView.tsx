import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { JumpData } from "../types/jumpDataFirebase";
import JumpCard from "./JumpCard";

interface JumpsListScrollViewProps {
  jumps: JumpData[];
  title?: string;
}

const JumpsListScrollView = ({
  jumps,
  title = "Jumps",
}: JumpsListScrollViewProps) => {
  const { theme } = useTheme();

  if (jumps.length === 0) {
    return null;
  }

  const sortedJumps = [...jumps].sort((a, b) => b.jumpNumber - a.jumpNumber);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {title} ({jumps.length})
      </Text>
      {sortedJumps.map((jump) => (
        <JumpCard key={jump.jumpNumber} jump={jump} />
      ))}
    </View>
  );
};

export default JumpsListScrollView;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
});
