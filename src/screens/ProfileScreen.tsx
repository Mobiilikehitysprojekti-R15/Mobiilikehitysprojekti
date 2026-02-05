import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Switch, ScrollView } from "react-native";
import StyledButton from "../components/StyledButton";
import ProfileAuth from "../components/ProfileAuth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types/auth";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc } from "firebase/firestore";

type Props = {};

const ProfileScreen = (props: Props) => {
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
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

    fetchProfile();
  }, [user]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <Text style={{ color: theme.colors.text }}>Loading...</Text>;
  if (!user) return <ProfileAuth />;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {profileLoading ? (
        <Text style={{ color: theme.colors.textSecondary }}>Loading profile...</Text>
      ) : profile ? (
        <>
          {/*PICTURE, NAME AND EMAIL centered, ei voi vielä asettaa profiilikuvaa*/}
          <View style={styles.nameCard}>
            <Image source={require("../assets/avatar-placeholder.png")}style={styles.avatar}/>
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

            {/*CHANGE INFO button, ei tapahu vielä mitään tästä*/}
            <StyledButton title="Change Info" onPress={() => {}} />
          </View>

          <View style={styles.headingCard}>
            <Text style={[styles.bold, { color: theme.colors.text }]}>Stats</Text>
            <Text style={{ color: theme.colors.text }}>Tähän vois laittaa montako hyppyä tehny tms pientä tietoa</Text>
            {/*STATS button, ei tapahu vielä mitään tästä*/}
            <StyledButton title="View Stats" onPress={() => {}} />
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
});
