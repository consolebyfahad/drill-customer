import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";

export default function Onboarding() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        setTimeout(() => {
          if (userId) {
            router.replace("/(tabs)");
          } else {
            router.replace("/");
          }
        }, 3000);
      } catch (error) {
        console.error("Error checking user data:", error);
        router.replace("/auth/login");
      }
    };

    checkUser();
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/onboarding.png")}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>The Home Service App</Text>
          <Text style={styles.description}>
            Application for easily finding a Home Serviceman
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Get Started" onPress={handleGetStarted} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  image: {
    width: "100%",
    marginBottom: 8,
  },
  textContainer: {
    alignItems: "center",
    width: "80%",
    marginHorizontal: "auto",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.secondary,
  },
  description: {
    textAlign: "center",
    fontSize: 18,
    color: Colors.secondary100,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
});
