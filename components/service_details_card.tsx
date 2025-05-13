import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import DashedSeprator from "./dashed_seprator";
import Star from "@/assets/svgs/Star.svg";
import { Colors } from "@/constants/Colors";

type Order = {
  id?: string;
  title?: string;
  status?: string;
  amount?: string;
  discount?: string;
  date?: string;
  provider?: string;
  paymentStatus?: string;
  rating?: string;
  tip?: string;
  image?: any;
  order_no?: string;
  timestamp?: string;
};

type ServiceDetailsCardProps = {
  order: Order;
  orderScreen?: boolean;
  onPress?: () => void;
};

export default function ServiceDetailsCard({
  order,
  orderScreen,
  onPress,
}: ServiceDetailsCardProps) {
  // Determine status color based on order status
  const getStatusStyle = () => {
    switch (order.status?.toLowerCase()) {
      case "completed":
        return { backgroundColor: Colors.success100, color: Colors.success };
      case "in-progress":
      case "pending":
        return { backgroundColor: Colors.warning100, color: Colors.warning };
      case "cancelled":
        return { backgroundColor: Colors.danger100, color: Colors.danger };
      default:
        return { backgroundColor: Colors.primary100, color: Colors.secondary };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
      {/* Order Top Section */}
      <View style={styles.orderTopSection}>
        <Image
          source={order.image}
          style={styles.image}
          resizeMode="cover"
          // defaultSource={require("@/assets/images/placeholder.png")} // Add a placeholder image in your assets
        />
        <View style={styles.orderInfo}>
          <View style={styles.orderHeader}>
            <Text style={styles.title}>{order.title || "Service"}</Text>
            <Text
              style={[
                styles.status,
                {
                  backgroundColor: statusStyle.backgroundColor,
                  color: statusStyle.color,
                },
              ]}
            >
              {order.status || "N/A"}
            </Text>
          </View>
          <Text style={styles.orderId}>
            Order ID:{" "}
            <Text style={styles.orderIdValue}>
              {order.order_no || order.id || "N/A"}
            </Text>
          </Text>
          <Text style={styles.amount}>
            SAR {order.amount || "0.00"}{" "}
            {order.discount && parseInt(order.discount) > 0 && (
              <Text style={styles.discount}>({order.discount}%)</Text>
            )}
          </Text>
        </View>
      </View>

      {/* Order Details Section */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Date & Time</Text>
          <Text style={styles.value}>
            {order.timestamp || order.date || "N/A"}
          </Text>
        </View>
        <DashedSeprator />

        <View style={styles.detailsRow}>
          <Text style={styles.label}>Provider</Text>
          <Text style={styles.value}>
            {order.provider ? order.provider : "Not assigned yet"}
          </Text>
        </View>
        <DashedSeprator />

        <View style={styles.detailsRow}>
          <Text style={styles.label}>Payment Status</Text>
          <Text style={styles.paymentStatus}>
            {order.paymentStatus || order.status || "N/A"}
          </Text>
        </View>

        {order.status?.toLowerCase() === "completed" && orderScreen && (
          <>
            <DashedSeprator />
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingContainer}>
                <Star />
                <Text style={styles.value}>{order.rating || "0"}</Text>
              </View>
            </View>
            <DashedSeprator />
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Tipped</Text>
              <Text style={styles.tip}>SAR {order.tip || "0"}</Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderTopSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  image: {
    height: 62,
    width: 62,
    borderRadius: 8,
    backgroundColor: Colors.white,
    padding: 8,
  },
  orderInfo: {
    flex: 1,
    gap: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  status: {
    padding: 8,
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 8,
    textTransform: "capitalize",
  },
  orderId: {
    fontSize: 14,
    color: Colors.secondary300,
  },
  orderIdValue: {
    fontWeight: "500",
  },
  amount: {
    fontSize: 14,
    color: Colors.secondary,
  },
  discount: {
    color: Colors.success,
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 16,
    marginTop: 12,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    color: Colors.secondary300,
    fontSize: 14,
  },
  value: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  paymentStatus: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tip: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: "500",
  },
});
