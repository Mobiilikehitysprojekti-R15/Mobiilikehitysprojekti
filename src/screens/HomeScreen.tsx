import { StyleSheet, ScrollView, View } from "react-native";
import YourDropzone from "../components/YourDropzone";
import WindStats from "../components/WindStats";
import GetGoproData from "../components/GetGoproData";

type Props = {};

const HomeScreen = (props: Props) => {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <YourDropzone />
        <WindStats />
        <GetGoproData />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
});
