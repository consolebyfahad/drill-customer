import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FONTS } from "~/constants/Fonts";
import { Colors } from "../constants/Colors";
import DashedSeprator from "./dashed_seprator";

export type Order = {
  id: string;
  title?: string;
  orderId?: string;
  order_no?: string;
  status: string;
  amount?: string;
  discount?: string;
  date?: string;
  timestamp?: string;
  customer?: string;
  provider?: any;
  paymentStatus?: string;
  payment_status?: string;
  rating?: string;
  tip?: string;
  image?: any;
  imageUrl?: string;
  image_url?: string;
  service_type?: string;
  schedule_date?: string;
  schedule_time?: string;
  category?: {
    name: string;
    image: string;
  };
};

type ServiceDetailsCardProps = {
  order: Order;
  orderScreen?: boolean;
  onPress?: () => void;
};

export default function ServiceDetailsCard({
  order,
  onPress,
}: ServiceDetailsCardProps) {
  // Function to format schedule date and time
  const formatScheduleDateTime = (dateString: string, timeString: string) => {
    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const [hours, minutes] = timeString.split(":").map(Number);

      const scheduleDate = new Date(year, month - 1, day, hours, minutes);

      const formattedDate = scheduleDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedTime = scheduleDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
      console.error("Error formatting schedule date/time:", error);
      return "Invalid date/time";
    }
  };

  // Function to get different status styles based on status
  const getStatusStyle = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return { backgroundColor: Colors.primary100, color: Colors.primary };
      case "pending":
        return { backgroundColor: "#FFF3CD", color: "#856404" };
      case "arrived":
        return { backgroundColor: "#FFF3CD", color: "#856404" };
      case "completed":
        return { backgroundColor: Colors.success100, color: Colors.success };
      case "cancelled":
        return { backgroundColor: "#F8D7DA", color: "#721C24" };
      default:
        return { backgroundColor: Colors.primary100, color: Colors.secondary };
    }
  };

  // Get the status style for the current order
  const statusStyle = getStatusStyle(order.status);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.7}>
      {/* Order Top Section */}
      <View style={styles.orderTopSection}>
        <Image
          source={{
            uri: `${order.imageUrl || order.image_url}${
              order?.category?.image
            }`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.orderInfo}>
          <View style={styles.orderHeader}>
            <Text style={styles.title}>
              {order?.category?.name || "Service Order"}
            </Text>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: statusStyle.backgroundColor },
              ]}
            >
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {order.status}
              </Text>
            </View>
          </View>
          <Text style={styles.orderId}>
            Order ID:{" "}
            <Text style={styles.orderIdValue}>
              {order.orderId || order.order_no}
            </Text>
          </Text>
          <Text style={styles.amount}>
            SAR {order.amount || "0.00"}{" "}
            {order.discount && parseInt(order.discount) > 0 && (
              <Text style={styles.discount}>({order.discount}% off)</Text>
            )}
          </Text>
        </View>
      </View>

      {/* Order Details Section */}
      <View style={styles.detailsContainer}>
        {/* Service Type and Schedule Information */}
        {order.service_type === "schedule" &&
        order.schedule_date &&
        order.schedule_time ? (
          <>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Service Type</Text>
              <Text style={[styles.value, { color: Colors.primary }]}>
                Scheduled
              </Text>
            </View>
            <DashedSeprator />
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Scheduled For</Text>
              <Text style={styles.value}>
                {formatScheduleDateTime(
                  order.schedule_date,
                  order.schedule_time
                )}
              </Text>
            </View>
            <DashedSeprator />
          </>
        ) : (
          <>
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Service Type</Text>
              <Text style={[styles.value, { color: Colors.primary }]}>
                Instant
              </Text>
            </View>
            <DashedSeprator />
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Date & Time</Text>
              <Text style={styles.value}>
                {order.date || order.timestamp || "N/A"}
              </Text>
            </View>
            <DashedSeprator />
          </>
        )}

        <View style={styles.detailsRow}>
          <Text style={styles.label}>Provider</Text>
          <Text style={styles.value}>
            {typeof order?.provider === "object"
              ? order?.provider?.name
              : order?.provider || "Not assigned yet"}
          </Text>
        </View>
        <DashedSeprator />
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Order Status</Text>
          <Text style={[styles.value, { color: statusStyle.color }]}>
            {order.status}
          </Text>
        </View>
        <DashedSeprator />

        <View style={styles.detailsRow}>
          <Text style={styles.label}>Payment Status</Text>
          <Text style={styles.paymentStatus}>
            {order?.paymentStatus || order?.payment_status || "Pending"}
          </Text>
        </View>
        {order.status === "completed" && (
          <>
            <DashedSeprator />
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.starIcon}>★</Text>
                <Text style={styles.value}>{order.rating || "0"}</Text>
              </View>
            </View>
            <DashedSeprator />
            <View style={styles.detailsRow}>
              <Text style={styles.label}>Tipped</Text>
              <Text style={styles.tip}>SAR {order.tip || "0.00"}</Text>
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
    shadowColor: Colors.gray100,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.01,
    shadowRadius: 6,
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
    padding: 12,
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
    fontFamily: FONTS.bold,
    color: Colors.secondary,
    flex: 1,
    textTransform: "capitalize",
  },
  statusContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    textTransform: "capitalize",
  },
  orderId: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: Colors.secondary300,
  },
  orderIdValue: { fontFamily: FONTS.semiBold },
  amount: {
    fontSize: 14,
    color: Colors.secondary,
    fontFamily: FONTS.semiBold,
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
    alignItems: "center",
    marginVertical: 8,
  },
  label: {
    color: Colors.secondary300,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  value: {
    color: Colors.secondary,
    fontSize: 14,
    fontFamily: FONTS.bold,
    textTransform: "capitalize",
  },
  paymentStatus: {
    color: Colors.success,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starIcon: {
    color: "#FFD700",
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  tip: {
    color: Colors.success,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
});
