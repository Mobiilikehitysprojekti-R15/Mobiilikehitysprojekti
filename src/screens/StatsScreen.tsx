import { StyleSheet, Text, View } from "react-native";
import StatisticsTest from "./StatisticsTest";
type Props = {};

const StatsScreen = (props: Props) => {
  return (
    <View>
      <Text>This is StatsScreen</Text>
      <StatisticsTest />
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({});
