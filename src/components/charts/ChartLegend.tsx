import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface LegendItem {
  color: string;
  label: string;
}

interface ChartLegendProps {
  items: LegendItem[];
}

const ChartLegend = ({ items }: ChartLegendProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ChartLegend;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
