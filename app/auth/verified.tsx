import Button from "@/components/button";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function Verified() {
  const { t } = useTranslation();
  const handleBrowse = () => {
    router.push("/auth/access_location");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/svgs/verified.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("verified.title")}</Text>
          <Text style={styles.subtitle}>{t("verified.subtitle")}</Text>
        </View>
      </View>

      <Button title={t("verified.browseHome")} onPress={handleBrowse} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.white,
  },
  content: {
    alignItems: "center",
    paddingTop: 100,
  },
  image: {
    width: "80%",
    height: 200,
    marginBottom: 16,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.secondary,
    marginBottom: 32,
    fontFamily: FONTS.medium,
  },
});
