import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import StyledButton from "../components/StyledButton";
import ProfileAuth from "../components/ProfileAuth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types/auth";

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
    <View style={{ backgroundColor: theme.colors.surface }}>
      {profileLoading ? (
        <Text style={{ color: theme.colors.textSecondary }}>Loading profile...</Text>
      ) : profile ? (
        <>
          <Text style={{ color: theme.colors.text }}>Name: {profile.name}</Text>
          <Text style={{ color: theme.colors.text }}>Email: {profile.email}</Text>
          <Text style={{ color: theme.colors.text }}>License Type: {profile.licenseType}</Text>
          <Text style={{ color: theme.colors.text }}>Phone Number: {profile.phoneNumber}</Text>
          <Text style={{ color: theme.colors.text }}>Address: {profile.address}</Text>
          <Text style={{ color: theme.colors.text }}>Date of Birth: {formatDate(profile.dateOfBirth)}</Text>
          <Text style={{ color: theme.colors.text }}>Member Since: {formatDate(profile.createdAt)}</Text>
        </>
      ) : (
        <Text style={{ color: theme.colors.textSecondary }}>Profile information not available</Text>
      )}
      <StyledButton onPress={signOut} title="Sign Out" />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
