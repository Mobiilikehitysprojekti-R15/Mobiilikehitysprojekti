import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import SignInModal from "./SignInModal";

type Props = {};

const ProfileAuth = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Text>Please sign in to view your profile</Text>
      <Button title="Sign In" onPress={() => setModalVisible(true)} />

      <SignInModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default ProfileAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
