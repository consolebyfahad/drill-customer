import Button from "@/components/button";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { apiCall } from "~/utils/api";

type CountryCode = {
  key: number;
  label: string;
  value: string;
};

const countryCodes: CountryCode[] = [
  { key: 1, label: "Kingdom Saudi Arabia (+966)", value: "+92" },
];

export default function Login(): JSX.Element {
  const [countryCode, setCountryCode] = useState<CountryCode>(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const modalRef = useRef<any>(null);

  const handleContinue = async () => {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    if (cleanedNumber.length < 9 || cleanedNumber.length > 10) {
      return;
    }

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
        // Toast.error(response.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      // Toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>
        Enter your phone {"\n"}number to get started.
      </Text>

      {/* Country Code Selector */}
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => modalRef.current.open()}
          style={styles.countrySelector}
        >
          <Image
            source={require("@/assets/images/saudia.png")}
            style={styles.countryFlag}
          />
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
          keyboardType="numeric" // Restricts input to numbers
          placeholderTextColor={Colors.secondary300}
          placeholder="Phone number"
          value={phoneNumber}
          maxLength={10} // Restrict input to 10 digits
          onChangeText={(text) => {
            // Allow only numbers
            const formattedText = text.replace(/[^0-9]/g, "");
            setPhoneNumber(formattedText);
          }}
        />
      </View>

      {/* Privacy & Terms */}
      <TouchableOpacity>
        <Text style={styles.privacyText}>Privacy & Agreements</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <Button title="Continue" onPress={handleContinue} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 84,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 28,
    color: Colors.secondary100,
    marginBottom: 32,
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
  countryFlag: {
    width: 32,
    height: 32,
  },
  countryText: {
    fontSize: 18,
    color: Colors.secondary,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: Colors.gray,
  },
  input: {
    padding: 16,
    fontSize: 18,
  },
  privacyText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.secondary,
    marginBottom: 24,
  },
});
