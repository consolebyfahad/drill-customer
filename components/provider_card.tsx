import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import DashedSeparator from "./dashed_seprator";
import Button from "./button";
import Call from "@/assets/svgs/Calling.svg";
import Message from "@/assets/svgs/Chat.svg";
import Track from "@/assets/svgs/routing.svg";
import { Colors } from "~/constants/Colors";
import { router } from "expo-router";

export default function ProviderCard({ provider }) {
  const handleCall = () => {};
  const handleChat = () => {
    router.push("/order/order_place");
  };
  const handleTrack = () => {
    router.push("/order/track");
  };
  return (
    <View style={styles.providerContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/images/user.png")}
          style={styles.providerImage}
        />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text
            style={styles.grayText}
          >{`⭐ ${provider.rating} (${provider.reviewscount}) | Provider`}</Text>
        </View>
      </View>
      <DashedSeparator />
      <View style={styles.buttonRow}>
        <Button
          Icon={<Call />}
          fullWidth={false}
          width={"30%"}
          title="Call"
          variant="secondary"
          onPress={handleCall}
        />
        <Button
          Icon={<Message />}
          fullWidth={false}
          width={"30%"}
          title="Chat"
          variant="primary"
          onPress={handleChat}
        />
        <Button
          Icon={<Track />}
          fullWidth={false}
          width={"30%"}
          title="Track"
          variant="secondary"
          onPress={handleTrack}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.primary300,
    borderRadius: 25,
    marginHorizontal: 16,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDetailsContainer: {
    backgroundColor: Colors.primary300,
    marginTop: 24,
    borderRadius: 25,
    padding: 16,
    marginBottom: 24,
  },
  activeTab: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: Colors.secondary,
    color: Colors.white,
    borderRadius: 25,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabText: { color: Colors.white, fontSize: 18, fontWeight: "500" },
  inactiveTabText: {
    color: Colors.secondary300,
    fontSize: 18,
    fontWeight: "500",
  },
  inactiveTab: {
    fontSize: 18,
    color: "gray",
    padding: 16,
    borderRadius: 25,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "500", color: Colors.secondary },
  orderDetails: {
    marginTop: 8,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boldText: { fontWeight: "500", color: Colors.secondary300 },
  blueText: { fontWeight: "bold", color: Colors.secondary },
  grayText: { color: Colors.secondary },
  problemImage: { width: 64, height: 64, borderRadius: 8 },
  separator: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "gray",
  },
  providerContainer: {
    padding: 16,
    backgroundColor: Colors.gray400,
    borderRadius: 12,
    marginTop: 8,
  },
  providerImage: { width: 48, height: 48, borderRadius: 24 },
  providerInfo: { marginLeft: 16 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatContainer: { flex: 1, padding: 16 },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  providerMessage: {
    alignSelf: "flex-start",
    backgroundColor: "lightgray",
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  whiteText: { color: "white" },
  chatInputContainer: { flexDirection: "row", borderTopWidth: 1, padding: 8 },
  chatInput: { flex: 1, borderWidth: 1, padding: 8, borderRadius: 8 },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    gap: 4,
  },
  providerName: {
    fontWeight: "600",
    color: Colors.secondary,
    fontSize: 18,
    marginBottom: 4,
  },
});
