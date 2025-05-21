import Button from "@/components/button";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function VerifiedScreen() {
  const router = useRouter();

  const handleBrowse = () => {
    router.push("/auth/access_location");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/svgs/verified.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>Verified!</Text>
          <Text style={styles.subtitle}>
            Hello! You have successfully verifed the account.
          </Text>
        </View>
      </View>

      <Button title="Browse Home" onPress={handleBrowse} />
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
  content: {
    alignItems: "center",
    paddingTop: 100,
  },
  image: {
    width: "80%",
    height: 200,
    marginBottom: 16,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.secondary,
    marginBottom: 32,
    fontFamily: FONTS.medium,
  },
});
