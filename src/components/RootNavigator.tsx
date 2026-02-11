import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomNavigation from "./BottomNavigation";
import StatsScreen from "../screens/StatsScreen";
import ChangeInfoScreen from "../screens/ChangeInfoScreen";

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

      {/* PROFILE → CHANGE INFO */} 
      <Stack.Screen
        name="ChangeInfo"
        component={ChangeInfoScreen}
        options={{ title: "Change Info" }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;