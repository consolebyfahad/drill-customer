import Arrow from "@/assets/svgs/arrowLeft.svg";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { apiCall } from "~/utils/api";

export default function Verify() {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { t } = useTranslation();

  const handleChangeText = (text: string) => {
    setCode(text);
    if (error) setError("");
  };

  const handleVerify = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    if (!userId) {
      setError(t("verify.userNotFound"));
      return;
    }

    if (code.length !== 4) {
      setError(t("verify.invalidCode"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", "verify_otp");
      formData.append("code", code);
      formData.append("user_id", userId);
      const response = await apiCall(formData);

      if (response.result) {
        await AsyncStorage.setItem("user_num_id", response?.user?.id);
        await AsyncStorage.setItem("user_name", response?.user?.name);
        setTimeout(() => router.push("/auth/verified"), 500);
      } else {
        setError(t("verify.verificationFailed"));
      }
    } catch (error) {
      console.error("Verification Error:", error);
      setError(t("verify.errorFallback"));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Arrow />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("verify.headerTitle")} </Text>
        <Text></Text>
      </View>

      <Text style={styles.title}>{t("verify.title")}</Text>
      <Text style={styles.subtitle}>{t("verify.subtitle")}</Text>

      <View
        style={[styles.otpContainer, error ? styles.otpContainerError : null]}
      >
        <OtpInput
          numberOfDigits={4}
          onTextChange={handleChangeText}
          focusColor={Colors.primary}
          theme={{
            containerStyle: styles.otpInputs,
            pinCodeContainerStyle: error
              ? { ...styles.otpInput, ...styles.otpInputError }
              : styles.otpInput,
            pinCodeTextStyle: styles.otpInputText,
            focusedPinCodeContainerStyle: styles.otpInputFocused,
          }}
          autoFocus
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity>
          <Text style={styles.resendText}>
            {t("verify.resendPrefix")}{" "}
            <Text style={styles.resendLink}>{t("verify.resendLink")}</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verify Button */}
      <Button title={t("verify.button")} onPress={handleVerify} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 38,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: "center",
    color: Colors.secondary,
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
    marginBottom: 24,
    fontFamily: FONTS.medium,
  },
  otpContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray100,
    paddingVertical: 26,
    borderRadius: 16,
    marginBottom: 24,
  },
  otpContainerError: {
    borderWidth: 1,
    borderColor: "red",
  },
  otpInputs: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
    justifyContent: "center",
  },
  otpInput: {
    width: 42,
    height: 42,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  otpInputFocused: {
    borderColor: Colors.primary,
  },
  otpInputText: {
    fontSize: 20,
    fontFamily: FONTS.regular,
    color: Colors.secondary,
  },
  otpInputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 16,
    paddingHorizontal: 12,
    textAlign: "center",
    fontFamily: FONTS.medium,
  },
  resendText: {
    fontSize: 16,
    color: Colors.secondary100,
    fontFamily: FONTS.medium,
  },
  resendLink: {
    color: Colors.primary,
    fontFamily: FONTS.medium,
  },
});
