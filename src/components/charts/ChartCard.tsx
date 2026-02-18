import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  compact?: boolean;
}

const ChartCard = ({ title, subtitle, children, compact = false }: ChartCardProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        compact ? styles.compactCard : styles.card,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
};

export default ChartCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  compactCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
    marginTop: -8,
  },
});
