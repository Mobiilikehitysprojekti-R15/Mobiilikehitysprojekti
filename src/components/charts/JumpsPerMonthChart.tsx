import React from "react";
import { BarChart } from "react-native-gifted-charts";
import { useTheme } from "../../context/ThemeContext";
import ChartCard from "./ChartCard";
import { BarDataItem } from "../../hooks/useJumpStats";

interface JumpsPerMonthChartProps {
  data: BarDataItem[];
  selectedYear: string | null;
}

const JumpsPerMonthChart = ({ data, selectedYear }: JumpsPerMonthChartProps) => {
  const { theme } = useTheme();

  if (data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((d) => d.value)) + 2;

  return (
    <ChartCard title={`Jumps in season ${selectedYear}`}>
      <BarChart
        data={data}
        barWidth={32}
        spacing={20}
        roundedTop
        xAxisThickness={1}
        yAxisThickness={1}
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.textSecondary }}
        xAxisLabelTextStyle={{ color: theme.colors.textSecondary }}
        noOfSections={4}
        maxValue={maxValue}
      />
    </ChartCard>
  );
};

export default JumpsPerMonthChart;
