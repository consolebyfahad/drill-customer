import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

const About = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>About This App</Text>
      <Text style={styles.description}>
        This app is designed to provide fast and reliable home services,
        including plumbing, electrical work, cleaning, and more. We aim to make
        it simple and convenient to book trusted professionals right from your
        phone.
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>App Version</Text>
        <Text style={styles.value}>v1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Developed by</Text>
        <Text style={styles.value}>utecho</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Support</Text>
        <Text style={styles.value}>support@drill.com</Text>
      </View>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  heading: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: Colors.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Colors.secondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Colors.secondary,
  },
  value: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: Colors.primary,
  },
});
