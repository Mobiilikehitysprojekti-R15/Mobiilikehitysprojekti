import React from "react";
import { View, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useTheme } from "../../context/ThemeContext";
import ChartCard from "./ChartCard";
import ChartLegend from "./ChartLegend";
import { PieDataItem } from "../../hooks/useJumpStats";

interface JumpTypesChartProps {
  data: PieDataItem[];
}

const LEGEND_ITEMS = [
  { color: "#4ECDC4", label: "Static Line" },
  { color: "#FF6B6B", label: "Free Fall" },
  { color: "#9B59B6", label: "FF >2km" },
];

const JumpTypesChart = ({ data }: JumpTypesChartProps) => {
  const { theme } = useTheme();

  return (
    <ChartCard title="Jump Types" compact>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          radius={60}
          textColor={theme.colors.text}
          textSize={12}
          showText
          focusOnPress
        />
      </View>
      <ChartLegend items={LEGEND_ITEMS} />
    </ChartCard>
  );
};

export default JumpTypesChart;

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 8,
  },
});
