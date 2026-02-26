import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function Welcome() {
  const { t, ready } = useTranslation();

  const handleGetStarted = () => {
    router.push("/auth/login");
  };

  // Demo sign-in for App Review: no phone/OTP required (Guideline 2.1)
  const handleDemoSignIn = async () => {
    await AsyncStorage.setItem("user_id", "demo");
    await AsyncStorage.setItem("user_name", "Demo User");
    router.replace("/(tabs)");
  };

  if (!ready) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          source={require("../assets/images/onboarding.png")}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("welcome")}</Text>
          <Text style={styles.subtitle}>{t("tagline")}</Text>
          <Text style={styles.description}>{t("intro")}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button title={t("getStarted")} onPress={handleGetStarted} />
        <TouchableOpacity style={styles.demoButton} onPress={handleDemoSignIn}>
          <Text style={styles.demoButtonText}>{t("demoSignIn")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: Colors.secondary,
    fontFamily: FONTS.medium,
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
    fontSize: 35,
    marginBottom: 8,
    color: Colors.secondary,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    marginBottom: 12,
    color: Colors.secondary,
  },
  description: {
    textAlign: "center",
    fontSize: 18,
    color: Colors.secondary100,
    paddingHorizontal: 20,
    fontFamily: FONTS.medium,
  },
  buttonContainer: {
    gap: 12,
  },
  demoButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  demoButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: FONTS.medium,
  },
});
