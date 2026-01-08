import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/header";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t("privacy.title")} backBtn={true} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t("privacy.introduction")}</Text>
        <Text style={styles.text}>{t("privacy.introductionText")}</Text>

        <Text style={styles.heading}>{t("privacy.informationWeCollect")}</Text>
        <Text style={styles.text}>{t("privacy.informationWeCollectText")}</Text>

        <Text style={styles.subheading}>
          {t("privacy.personalInformation")}
        </Text>
        <Text style={styles.text}>{t("privacy.personalInformationText")}</Text>

        <Text style={styles.subheading}>{t("privacy.usageInformation")}</Text>
        <Text style={styles.text}>{t("privacy.usageInformationText")}</Text>

        <Text style={styles.subheading}>{t("privacy.deviceInformation")}</Text>
        <Text style={styles.text}>{t("privacy.deviceInformationText")}</Text>

        <Text style={styles.heading}>{t("privacy.howWeUse")}</Text>
        <Text style={styles.text}>{t("privacy.howWeUseText")}</Text>

        <Text style={styles.heading}>{t("privacy.dataSharing")}</Text>
        <Text style={styles.text}>{t("privacy.dataSharingText")}</Text>

        <Text style={styles.heading}>{t("privacy.dataSecurity")}</Text>
        <Text style={styles.text}>{t("privacy.dataSecurityText")}</Text>

        <Text style={styles.heading}>{t("privacy.yourRights")}</Text>
        <Text style={styles.text}>{t("privacy.yourRightsText")}</Text>

        <Text style={styles.heading}>{t("privacy.changes")}</Text>
        <Text style={styles.text}>{t("privacy.changesText")}</Text>

        <Text style={styles.heading}>{t("privacy.contactUs")}</Text>
        <Text style={styles.text}>{t("privacy.contactUsText")}</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("privacy.lastUpdated")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: Colors.secondary,
    marginTop: 24,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: Colors.secondary100,
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
  },
  footerText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: Colors.secondary300,
    textAlign: "center",
  },
});
