import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Switch, ScrollView } from "react-native";
import StyledButton from "../components/StyledButton";
import ProfileAuth from "../components/ProfileAuth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../config/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { UserProfile } from "../types/auth";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { getStorage } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Tabs: undefined;
  Stats: undefined;
  ChangeInfo: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Tabs">;
type Props = {};

const ProfileScreen = (props: Props) => {
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [jumpCount, setJumpCount] = useState<number | null>(null);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const [notifications, setNotifications] = useState<{ [key: string]: boolean }>({
    notification1: false,
  });

  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const storage = getStorage();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // FETCH JUMPS COUNT
  useEffect(() => {
    const fetchJumpCount = async () => {
      if (!user) return;

      try {
        const jumpsRef = collection(db, "jumps");
        const q = query(jumpsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        setJumpCount(snapshot.size);
      } catch (err) {
        console.error("Failed to fetch jumps:", err);
      }
    };

    fetchJumpCount();
  }, [user]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <Text style={{ color: theme.colors.text }}>Loading...</Text>;
  if (!user) return <ProfileAuth />;

  const pickAndSaveProfileImage = async () => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 1,
  });

    if (result.canceled || !user) return;

    const image = result.assets[0];

    // Resize 128x128 + JPEG + base64
    const manipulated = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 128, height: 128 } }],
      {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!manipulated.base64) return;

    await updateDoc(doc(db, "users", user.uid), {
      profileImageBase64: manipulated.base64,
    });

    setProfile((prev) =>
      prev
        ? { ...prev, profileImageBase64: manipulated.base64 }
        : prev
    );
  } catch (err) {
    console.error("Profile image error:", err);
  }
};

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {profileLoading ? (
        <Text style={{ color: theme.colors.textSecondary }}>Loading profile...</Text>
      ) : profile ? (
        <>
          {/*PICTURE, NAME AND EMAIL centered*/}
          <View style={styles.nameCard}>
            <TouchableOpacity onPress={pickAndSaveProfileImage}>
              <Image style={styles.avatar} source={profile.profileImageBase64
              ? {uri: `data:image/jpeg;base64,${profile.profileImageBase64}`,}
              : require("../assets/avatar-placeholder.png")}
            />
            </TouchableOpacity>

            <View style={styles.nameText}>
              <Text style={[styles.bold, { color: theme.colors.text }]}>{profile.name || "Your name"}</Text>
              <Text style={{ color: theme.colors.text }}>{profile.email || "Your email"}</Text>
            </View>
          </View>

          {/*LICENSE*/}
          <View style={styles.headingCard}>
            <Text style={[styles.bold, { color: theme.colors.text }]}>License</Text>
            <Text style={{ color: theme.colors.text }}>{profile?.licenseType || "Student/A/B/C/D"}</Text>
          </View>

          {/*PERSONAL INFO*/}
          <View style={styles.headingCard}>
            <Text style={[styles.bold, { color: theme.colors.text }]}>Personal info</Text>
            <Text style={{ color: theme.colors.text }}>Phone Number: {profile.phoneNumber}</Text>
            <Text style={{ color: theme.colors.text }}>Address: {profile.address}</Text>
            <Text style={{ color: theme.colors.text }}>Date of Birth: {formatDate(profile.dateOfBirth)}</Text>
            <Text style={{ color: theme.colors.text }}>Member Since: {formatDate(profile.createdAt)}</Text>

            {/*CHANGE INFO button*/}
            <StyledButton title="Show More/Change Info"
              onPress={() =>
                navigation.getParent()?.navigate("ChangeInfo", {
                  onSave: () => fetchProfile(), 
                })
              } />
          </View>

          {/*STATS*/}
          <View style={styles.headingCard}>
            <Text style={[styles.bold, { color: theme.colors.text }]}>Stats</Text>
            {/*LOGGED JUMPS count*/}
            <Text style={{ color: theme.colors.text }}>You have logged {jumpCount} jumps</Text>
            {/*STATS button*/}
            <StyledButton title="View Stats" onPress={() => navigation.getParent()?.navigate("Stats")} />
          </View>

          {/*NOTIFICATIONS*/}
          <View style={styles.headingCard}>
            <Text style={[styles.bold, { color: theme.colors.text }]}>Notifications</Text>

            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: notifications.notification1 ? theme.colors.primary : theme.colors.surface,
                  },
                ]}
                onPress={() => toggleNotification("notification1")}
              >
                {notifications.notification1 && (
                  <Text style={[styles.checkmark, { color: theme.colors.surface }]}>✓</Text>
                )}
              </TouchableOpacity>
              <Text style={[styles.checkboxLabel, { color: theme.colors.text }]}>Notification 1</Text>
            </View>
          </View>

          {/*THEME TOGGLE*/}
          <View style={styles.headingCard}>
            <Text style={[styles.bold, { color: theme.colors.text }]}>Theme</Text>
            <View style={styles.themeRow}>
              <Text style={{ color: theme.colors.text }}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#E0E0E0", true: "#666666" }}
                thumbColor={isDark ? "#FFFFFF" : "#1E1E1E"}
              />
            </View>
          </View>

          <View style={{ marginBottom: 60 }}>
            <StyledButton title="Sign out" onPress={signOut} />
          </View>
        </>
      ) : (
        <Text style={{ color: theme.colors.textSecondary }}>Profile information not available</Text>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bold: {
    fontSize: 22,
    fontWeight: "600",
  },
  headingCard: {
    fontSize: 24,
    fontWeight: "600",
    paddingVertical: 10,
    paddingTop: 20,
  },
    welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
    avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
  },
    nameCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
    nameText: {
    alignItems: "flex-start",
  },
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  checkboxRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 10,
  marginBottom: 10,
},
checkbox: {
  width: 24,
  height: 24,
  borderWidth: 2,
  borderRadius: 4,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},
checkmark: {
  fontSize: 16,
  fontWeight: "bold",
},
checkboxLabel: {
  fontSize: 16,
},
});
