import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import ProfileAuth from "../components/ProfileAuth";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types/auth";

type Props = {};

const ProfileScreen = (props: Props) => {
  const { user, loading, signOut } = useAuth();
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

  if (loading) return <Text>Loading...</Text>;
  if (!user) return <ProfileAuth />;

  return (
    <View style={styles.container}>
      {profileLoading ? (
        <Text>Loading profile...</Text>
      ) : profile ? (
        <>
          <Text>Name: {profile.name}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>License Type: {profile.licenseType}</Text>
          <Text>Phone Number: {profile.phoneNumber}</Text>
          <Text>Address: {profile.address}</Text>
          <Text>Date of Birth: {formatDate(profile.dateOfBirth)}</Text>
          <Text>Member Since: {formatDate(profile.createdAt)}</Text>
        </>
      ) : (
        <Text>Profile information not available</Text>
      )}
      <Button onPress={signOut} title="Sign Out" />
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
