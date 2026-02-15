import { StatusBar } from "expo-status-bar";
import RootNavigator from "./components/RootNavigator";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import BottomNavigation from "./components/BottomNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import { DropzoneProvider } from "./context/DropzoneContext";
import { ThemeProvider } from "./context/ThemeContext";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import * as Notifications from 'expo-notifications';
import { cancelAllScheduledNotificationsAsync, dismissAllNotificationsAsync } from "expo-notifications";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Notifications.scheduleNotificationAsync({
  content:{
    title: "Conditions in your dropzone",
    body: "Check the weather in your dropzone and see if it's a good day for skydiving!",

  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 60 * 60 * 24, // every 24 hours
    repeats: true
  }
})

export default function App() {

  
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <ThemeProvider>
    <AuthProvider>
      <DropzoneProvider>
        <NavigationContainer>
          <RootNavigator/>
        </NavigationContainer>
      </DropzoneProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
