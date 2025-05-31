import Tick from "@/assets/svgs/doubletick.svg";
import Button from "@/components/button";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function ConfirmedBooking() {
  const { t } = useTranslation();

  const handleNext = () => {
    router.push("/order/order_place");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Section */}
      <View style={styles.imageContainer}>
        <Tick />
        <View style={styles.textContainer}>
          <Text style={styles.heading}>{t("booking.heading")}</Text>
          <Text style={styles.paragraph}>{t("booking.paragraph")}</Text>
        </View>
      </View>

      {/* Note and Button */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          <Text style={styles.boldText}>{t("booking.note")}</Text>
        </Text>
        <Button title={t("booking.button")} onPress={handleNext} />
      </View>
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
  imageContainer: {
    alignItems: "center",
    paddingTop: 128,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 50,
  },
  heading: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    color: Colors.secondary,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: "center",
    color: Colors.secondary300,
    marginBottom: 32,
  },
  noteContainer: {
    backgroundColor: Colors.primary200,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  noteText: {
    color: Colors.secondary,
  },
  boldText: { fontFamily: FONTS.bold },
});
