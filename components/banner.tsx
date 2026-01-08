import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Common banner aspect ratio (approximately 16:9 or 2:1)
const BANNER_ASPECT_RATIO = 2.1; // width / height ratio
const BANNER_WIDTH_PERCENTAGE = 0.98; // 98% of screen width
const BANNER_WIDTH = SCREEN_WIDTH * BANNER_WIDTH_PERCENTAGE;
const BANNER_HEIGHT = BANNER_WIDTH / BANNER_ASPECT_RATIO;

export default function Banner() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/banner.png")}
        style={styles.image}
        resizeMode="cover"
      />
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
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 8, // Optional: add slight border radius for better appearance
  },
});
