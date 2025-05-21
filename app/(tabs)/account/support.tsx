import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

const Support = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Need Help?</Text>
      <Text style={styles.subheading}>
        If you have any questions or need assistance, feel free to reach out to
        our support team.
      </Text>

      <View style={styles.card}>
        <Ionicons name="mail-outline" size={24} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Email Support</Text>
          <Text style={styles.cardText}>support@yourapp.com</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="call-outline" size={24} color={Colors.primary} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Call Us</Text>
          <Text style={styles.cardText}>+1 (800) 123-4567</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Chat with Support</Text>
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
