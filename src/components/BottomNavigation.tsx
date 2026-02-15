import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Text } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import NewScreen from "../screens/NewScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LogbookScreen from "../screens/LogbookScreen";
import WeatherScreen from "../screens/WeatherScreen";
import { useTheme } from "../context/ThemeContext";
import NotificationTest from "../screens/NotificationScreen";

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        headerTitleStyle: {
          fontFamily: "Inter_700Bold",
        },
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBackground,
        },
      }}
      // change this if feels bad to use, history/fullHistory maybe
      backBehavior="firstRoute"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontFamily: focused ? "Inter_700Bold" : "Inter_500Medium",
                color: focused
                  ? theme.colors.tabBarActive
                  : theme.colors.tabBarInactive,
                fontSize: 10,
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="wind" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontFamily: focused ? "Inter_700Bold" : "Inter_500Medium",
                color: focused
                  ? theme.colors.tabBarActive
                  : theme.colors.tabBarInactive,
                fontSize: 10,
              }}
            >
              Weather
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="New"
        component={NewScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontFamily: focused ? "Inter_700Bold" : "Inter_500Medium",
                color: focused
                  ? theme.colors.tabBarActive
                  : theme.colors.tabBarInactive,
                fontSize: 10,
              }}
            >
              New
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Logbook"
        component={LogbookScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontFamily: focused ? "Inter_700Bold" : "Inter_500Medium",
                color: focused
                  ? theme.colors.tabBarActive
                  : theme.colors.tabBarInactive,
                fontSize: 10,
              }}
            >
              Logbook
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontFamily: focused ? "Inter_700Bold" : "Inter_500Medium",
                color: focused
                  ? theme.colors.tabBarActive
                  : theme.colors.tabBarInactive,
                fontSize: 10,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;





/*

<Tab.Screen
        name="NotificationTest"
        component={NotificationTest}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontFamily: focused ? "Inter_700Bold" : "Inter_500Medium",
                color: focused
                  ? theme.colors.tabBarActive
                  : theme.colors.tabBarInactive,
                fontSize: 10,
              }}
            >
              Home
            </Text>
          ),
        }}
      />
*/
