import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SignInModal from "./SignInModal";
import StyledButton from "./StyledButton";

type Props = {
  text?: string;
};

const ProfileAuth = ({
  text = "Please sign in to view your profile",
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <StyledButton title="Sign In" onPress={() => setModalVisible(true)} />

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
