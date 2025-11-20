import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/header";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

const About = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Header title={t("account.aboutApp")} backBtn={true} />
      <Text style={styles.heading}>{t("about.aboutApp")}</Text>
      <Text style={styles.description}>
        {t("about.appDescription")}
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>{t("about.appVersion")}</Text>
        <Text style={styles.value}>{t("about.version")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t("about.developedBy")}</Text>
        <Text style={styles.value}>{t("about.developer")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t("about.support")}</Text>
        <Text style={styles.value}>{t("about.supportEmail")}</Text>
      </View>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Colors.secondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Colors.secondary,
  },
  value: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: Colors.primary,
  },
});
