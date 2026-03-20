import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

/**
 * Splash: always go to main app so users can browse without logging in.
 * Login is only required for account-based actions (booking, orders, account).
 */
export default function Splash() {
  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/splash.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
