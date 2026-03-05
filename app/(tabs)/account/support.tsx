import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "~/components/header";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

const SUPPORT_EMAIL = "support@drill.com";
const SUPPORT_PHONE = "+966500000000"; // Replace with real support number

const Support = () => {
  const { t } = useTranslation();

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() =>
      Alert.alert(t("error"), t("support.emailError"))
    );
  };

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`).catch(() =>
      Alert.alert(t("error"), t("support.callError"))
    );
  };

  const handleChat = async () => {
    const orderId = await AsyncStorage.getItem("order_id");
    if (orderId) {
      router.push({ pathname: "/order/order_place", params: { tab: "Chat" } });
    } else {
      Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t("support.chatSubject"))}`).catch(() =>
        Alert.alert(t("error"), t("support.emailError"))
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={t("account.support")} backBtn={true} />
      <Text style={styles.heading}>{t("support.needHelp")}</Text>
      <Text style={styles.subheading}>
        {t("support.supportDescription")}
      </Text>

      <TouchableOpacity style={styles.card} onPress={handleEmail} activeOpacity={0.7}>
        <Ionicons name="mail-outline" size={24} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{t("support.emailSupport")}</Text>
          <Text style={styles.cardText}>{SUPPORT_EMAIL}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleCall} activeOpacity={0.7}>
        <Ionicons name="call-outline" size={24} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{t("support.callUs")}</Text>
          <Text style={styles.cardText}>{SUPPORT_PHONE}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleChat} activeOpacity={0.8}>
        <Text style={styles.buttonText}>{t("support.chatWithSupport")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 12,
  },
  heading: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: Colors.primary,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Colors.secondary,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardContent: {
    marginLeft: 12,
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: Colors.primary,
  },
  cardText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: Colors.secondary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});
