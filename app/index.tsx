import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function Splash() {
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        console.log("userId", userId);
        setTimeout(() => {
          if (userId) {
            router.replace("/(tabs)");
          } else {
            router.replace("/welcome");
          }
        }, 2000);
      } catch (error) {
        console.error("Error checking user data:", error);
        router.replace("/welcome");
      }
    };

    checkUser();
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
