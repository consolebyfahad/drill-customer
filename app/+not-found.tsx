import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Button from "@/components/button";
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen(): JSX.Element {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="alert-circle-outline" size={100} color="#FF3B30" />
      <Text style={styles.errorText}>404</Text>
      <Text style={styles.messageText}>Oops! Page not found.</Text>
      <Button title="Go Home" onPress={() => router.push("/splash")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  errorText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
});
