import Flag from "@/assets/svgs/saudiarabia.svg";
import Button from "@/components/button";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { apiCall } from "~/utils/api";

type CountryCode = {
  key: number;
  label: string;
  value: string;
};

const countryCodes: CountryCode[] = [
  { key: 1, label: "Kingdom Saudi Arabia (+966)", value: "+966" },
];

export default function Login() {
  const [countryCode, setCountryCode] = useState<CountryCode>(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<string>("");
  const modalRef = useRef<any>(null);
  const { t } = useTranslation();

  const handleContinue = async () => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    if (cleanedNumber.length < 9 || cleanedNumber.length > 10) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    try {
      await AsyncStorage.clear();
      const formData = new FormData();
      formData.append("type", "register_phone");
      formData.append("phone", `${countryCode.value}${cleanedNumber}`);
      formData.append("user_type", "user");
      const response = await apiCall(formData);
      if (response.result) {
        await AsyncStorage.setItem("user_id", response.user_id);
        await AsyncStorage.setItem("user_type", response.user_type);
        router.push("/auth/verify");
      } else {
        setError(response.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(t("login.invalidPhone"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t("welcome")}</Text>
      <Text style={styles.subtitle}>{t("login.subtitle")}</Text>

      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : null,
        ]}
      >
        <TouchableOpacity
          onPress={() => modalRef.current.open()}
          style={styles.countrySelector}
        >
          <Flag width={25} height={25} />
          <Text style={styles.countryText}>{countryCode.label}</Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        <ModalSelector
          ref={modalRef}
          data={countryCodes}
          onChange={(option: CountryCode) => setCountryCode(option)}
          style={{ borderWidth: 0, backgroundColor: "transparent" }}
          selectStyle={{ display: "none" }}
        />

        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholderTextColor={Colors.secondary300}
          placeholder={t("login.phonePlaceholder")}
          value={phoneNumber}
          maxLength={10}
          onChangeText={(text) => {
            setPhoneNumber(text.replace(/\D/g, ""));
            if (error) setError("");
          }}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.consentText}>
        {t("login.consentPrefix")}{" "}
        <Text
          style={styles.privacyLink}
          onPress={() => router.push("/auth/privacy")}
        >
          {t("login.privacy")}
        </Text>
        {t("login.consentSuffix")}
      </Text>

      <Button title={t("continue")} onPress={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 84,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 28,
    color: Colors.secondary100,
    marginBottom: 32,
    fontFamily: FONTS.regular,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  countryText: {
    fontSize: 16,
    color: Colors.secondary,
    fontFamily: FONTS.regular,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: Colors.gray,
  },
  input: {
    padding: 16,
    fontSize: 18,
  },
  consentText: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: Colors.secondary100,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  privacyLink: {
    fontFamily: FONTS.semiBold,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  inputContainerError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -20,
    marginBottom: 16,
    paddingLeft: 12,
    fontFamily: FONTS.regular,
  },
});
