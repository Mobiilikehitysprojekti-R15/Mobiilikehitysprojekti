import React from "react";
import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "../../context/ThemeContext";
import ChartCard from "./ChartCard";
import { BarDataItem } from "../../hooks/useJumpStats";

interface TopDropzonesChartProps {
  data: BarDataItem[];
}

const TopDropzonesChart = ({ data }: TopDropzonesChartProps) => {
  const { theme } = useTheme();

  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((d) => d.value)) + 2;

  return (
    <ChartCard title="Top Dropzones">
      <BarChart
        data={data}
        barWidth={40}
        spacing={24}
        roundedTop
        xAxisThickness={1}
        yAxisThickness={1}
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.textSecondary }}
        xAxisLabelTextStyle={{
          color: theme.colors.textSecondary,
          fontSize: 10,
        }}
        noOfSections={4}
        maxValue={maxValue}
      />
    </ChartCard>
  );
};

export default TopDropzonesChart;
