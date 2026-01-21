import { Button, StyleSheet, Text, View } from "react-native";
import ProfileAuth from "../components/ProfileAuth";
import { useAuth } from "../context/AuthContext";

type Props = {};

const ProfileScreen = (props: Props) => {
  const { user, loading, signOut } = useAuth();

  if (loading) return <Text>Loading...</Text>;
  if (!user) return <ProfileAuth />;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.email}</Text>
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
