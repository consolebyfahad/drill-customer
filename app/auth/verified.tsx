import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Button from "@/components/button";
import { Colors } from "~/constants/Colors";

export default function VerifiedScreen(): JSX.Element {
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
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.secondary,
    marginBottom: 32,
  },
});
