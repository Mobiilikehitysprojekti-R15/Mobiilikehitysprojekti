import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigation from "./BottomNavigation";
import StatsScreen from "../screens/StatsScreen";
import JumpInfoScreen from "../screens/JumpInfoScreen";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      {/* TAB-NAVIGAATIO */}
      <Stack.Screen
        name="Tabs"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />

      {/* PROFILE → VIEW STATS */}
      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: "Stats" }}
      />

      {/* JUMP INFO SCREEN */}
      <Stack.Screen
        name="JumpInfo"
        component={JumpInfoScreen}
        options={{ title: "Jump Details" }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;