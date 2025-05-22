import Button from "@/components/button";
import { useNavigation } from "expo-router";
import { useState } from "react";
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
  const [saveInfo, setSaveInfo] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Header backBtn={true} title="Add Card" />
        <Image
          source={require("@/assets/images/card.png")}
          style={styles.cardImage}
          resizeMode="contain"
        />

        <Text style={styles.label}>Card holder name</Text>
        <TextInput style={styles.input} placeholder="Card holder name" />

        <Text style={styles.label}>Card number</Text>
        <TextInput
          style={styles.input}
          placeholder="Card number"
          keyboardType="numeric"
        />

        <View style={styles.rowBetween}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expired</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="Code"
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.label}>Save my card details for next time.</Text>
          <Switch value={saveInfo} onValueChange={setSaveInfo} />
        </View>

        {saveInfo && (
          <>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="0123456789"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              keyboardType="email-address"
            />
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button title="Save" onPress={() => console.log("Card Saved")} />
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
