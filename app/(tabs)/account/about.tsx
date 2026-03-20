import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/header";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";

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
  container: { flex: 1, backgroundColor: Colors.white, paddingHorizontal: s(20), paddingTop: vs(16) },
  heading: { fontSize: ms(21), fontFamily: FONTS.bold, color: Colors.primary, marginBottom: vs(10) },
  description: { fontSize: ms(13), fontFamily: FONTS.medium, color: Colors.secondary, lineHeight: ms(22), marginBottom: vs(18) },
  section: { marginBottom: vs(14) },
  label: { fontSize: ms(13), fontFamily: FONTS.medium, color: Colors.secondary },
  value: { fontSize: ms(15), fontFamily: FONTS.bold, color: Colors.primary },
});
