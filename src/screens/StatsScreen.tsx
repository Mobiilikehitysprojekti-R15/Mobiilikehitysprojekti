import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import StatisticsTest from "./StatisticsTest";
type Props = {};

const StatsScreen = (props: Props) => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Statistics</Text>
      <StatisticsTest />
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({});
