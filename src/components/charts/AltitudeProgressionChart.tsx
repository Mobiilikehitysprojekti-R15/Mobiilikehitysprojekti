import React from "react";
import { LineChart } from "react-native-gifted-charts";
import { useTheme } from "../../context/ThemeContext";
import ChartCard from "./ChartCard";
import { LineDataItem } from "../../hooks/useJumpStats";

interface AltitudeProgressionChartProps {
  data: LineDataItem[];
}

const AltitudeProgressionChart = ({ data }: AltitudeProgressionChartProps) => {
  const { theme } = useTheme();

  if (data.length <= 1) {
    return null;
  }

  return (
    <ChartCard title="Altitude Progression" subtitle="Exit altitude over time (meters)">
      <LineChart
        data={data}
        color="#9B59B6"
        thickness={2}
        curved
        hideDataPoints={data.length > 20}
        dataPointsColor="#9B59B6"
        xAxisThickness={1}
        yAxisThickness={1}
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.textSecondary }}
        xAxisLabelTextStyle={{ color: theme.colors.textSecondary }}
        noOfSections={4}
      />
    </ChartCard>
  );
};

export default AltitudeProgressionChart;
