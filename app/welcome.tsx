import Button from "@/components/button";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function Welcome() {
  const { t } = useTranslation();
  const handleGetStarted = () => {
    router.push("/auth/login");
  };

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
      <Button title={t("getStarted")} onPress={handleGetStarted} />
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
});
