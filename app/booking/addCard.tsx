import Button from "@/components/button";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "~/components/header";
import { FONTS } from "~/constants/Fonts";

export default function AddCard() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [saveInfo, setSaveInfo] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Header backBtn={true} title={t("addCard")} />
        <Image
          source={require("@/assets/images/card.png")}
          style={styles.cardImage}
          resizeMode="contain"
        />

        <Text style={styles.label}>{t("booking.cardHolderName")}</Text>
        <TextInput style={styles.input} placeholder={t("booking.cardHolderName")} />

        <Text style={styles.label}>{t("booking.cardNumber")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("booking.cardNumber")}
          keyboardType="numeric"
        />

        <View style={styles.rowBetween}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("booking.expired")}</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("booking.cvv")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("booking.code")}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.label}>{t("booking.saveCardDetails")}</Text>
          <Switch value={saveInfo} onValueChange={setSaveInfo} />
        </View>

        {saveInfo && (
          <>
            <Text style={styles.label}>{t("booking.phoneNumber")}</Text>
            <TextInput
              style={styles.input}
              placeholder="0123456789"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>{t("booking.emailAddress")}</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              keyboardType="email-address"
            />
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button title={t("save")} onPress={() => console.log("Card Saved")} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#E5E7EB",
    padding: 8,
    borderRadius: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.semiBold,
    marginLeft: 16,
    color: "#374151",
  },
  cardImage: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#E5E7EB",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputContainer: {
    width: "48%",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  footer: {
    padding: 24,
  },
});
