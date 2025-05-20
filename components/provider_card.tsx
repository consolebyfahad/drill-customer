import Call from "@/assets/svgs/Calling.svg";
import Message from "@/assets/svgs/Chat.svg";
import Track from "@/assets/svgs/routing.svg";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "~/constants/Colors";
import Button from "./button";
import DashedSeparator from "./dashed_seprator";

export default function ProviderCard({ order }) {
  console.log("order==", order);

  // Get the current route name to check if we're on the track screen
  const route = useRoute();
  const isOnTrackScreen = route.name === "order/track";
  if (!order) {
    return (
      <View style={styles.providerContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading provider details...</Text>
        </View>
      </View>
    );
  }
  const provider = order.provider || {};
  const handleCall = () => {};
  const handleChat = () => {
    router.push("/order/order_place");
  };
  const handleTrack = () => {
    {
      !isOnTrackScreen &&
        router.push({
          pathname: "/order/track",
          params: { orderId: order.id },
        });
    }
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
          <Text style={styles.providerName}>{provider.name || "Unknown"}</Text>
          <Text style={styles.grayText}>{`⭐ ${provider.rating || 0} (${
            provider.reviewscount || 0
          })`}</Text>
          <Text style={styles.grayText}>{` Provider`}</Text>
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
        {/* Only show Track button if NOT on track screen */}

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
  providerName: {
    fontWeight: "600",
    color: Colors.secondary,
    fontSize: 18,
    marginBottom: 4,
  },
  grayText: { color: Colors.secondary },
  loadingContainer: {
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: Colors.secondary,
    fontSize: 14,
  },
});
