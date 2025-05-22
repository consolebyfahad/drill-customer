import Tick from "@/assets/svgs/doubletick.svg";
import Button from "@/components/button";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function ConfirmedBooking() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/order/order_place");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Image at the top */}
      <View style={styles.imageContainer}>
        <Tick />
        <View style={styles.textContainer}>
          {/* Welcome heading */}
          <Text style={styles.heading}>Booking placed successfully</Text>
          {/* Paragraph */}
          <Text style={styles.paragraph}>
            Thanks for your Booking. Your Booking has been placed successfully.
            App will auto-assign you a service provider.
          </Text>
        </View>
      </View>

      {/* Get Started button */}
      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          <Text style={styles.boldText}>Note:</Text> If service time exceeds
          from the requested package, then you will be shifted to a higher
          package and the cost will be added to your total payments.
        </Text>
        <Button title={"Go to Order"} onPress={handleNext} />
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
