import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useTheme } from "../../context/ThemeContext";
import ChartCard from "./ChartCard";
import ChartLegend from "./ChartLegend";
import { PieDataItem } from "../../hooks/useJumpStats";

interface AcceptedStatusChartProps {
  data: PieDataItem[];
  totalCount: number;
}

const LEGEND_ITEMS = [
  { color: "#2ECC71", label: "Accepted" },
  { color: "#E74C3C", label: "Pending" },
];

const AcceptedStatusChart = ({ data, totalCount }: AcceptedStatusChartProps) => {
  const { theme } = useTheme();

  return (
    <ChartCard title="Accepted Status" compact>
      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          radius={60}
          innerRadius={35}
          textColor={theme.colors.text}
          textSize={12}
          showText
          focusOnPress
          centerLabelComponent={() => (
            <Text style={[styles.centerLabel, { color: theme.colors.text }]}>
              {totalCount}
            </Text>
          )}
        />
      </View>
      <ChartLegend items={LEGEND_ITEMS} />
    </ChartCard>
  );
};

export default AcceptedStatusChart;

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 8,
  },
  centerLabel: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
});
