import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SignInModal from "./SignInModal";
import StyledButton from "./StyledButton";
import { useTheme } from "../context/ThemeContext";

type Props = {
  text?: string;
};

const ProfileAuth = ({
  text = "Please sign in to view your profile",
}: Props) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.text, { color: theme.colors.text }]}>{text}</Text>
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
  text: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});

