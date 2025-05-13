import BannerImage from "@/assets/svgs/banner.svg";
import { StyleSheet, View } from "react-native";

export default function Banner() {
  return (
    <View style={styles.container}>
      <BannerImage width="100%" height="180" style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    alignSelf: "center",
  },
});
