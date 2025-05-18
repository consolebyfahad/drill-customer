import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import OrderDetailsSection from "~/components/order_details";
import ProviderCard from "~/components/provider_card";
import ServiceDetailsCard from "~/components/service_details_card";
import { Colors } from "~/constants/Colors";
import { OrderType } from "~/types/dataTypes";

interface OrderDetailsProps {
  order: OrderType;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  return (
    <ScrollView
      style={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ServiceDetailsCard order={order} />
      <View style={styles.orderDetailsContainer}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => setShowOrderDetails(!showOrderDetails)}
        >
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text style={styles.grayText}>
            {showOrderDetails ? (
              <Ionicons
                name="chevron-down"
                size={20}
                color={Colors.secondary300}
              />
            ) : (
              <Ionicons
                name="chevron-up"
                size={20}
                color={Colors.secondary300}
              />
            )}
          </Text>
        </TouchableOpacity>
        {showOrderDetails && <OrderDetailsSection order={order} />}
      </View>
      <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>
        About Service Provider
      </Text>

      {order.provider ? (
        <ProviderCard provider={order.provider} />
      ) : (
        <View style={styles.noProviderContainer}>
          <Text style={styles.noProviderText}>
            No provider assigned yet. We'll notify you when a provider accepts
            your request.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
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
    marginVertical: 4,
  },
  boldText: { fontWeight: "500", color: Colors.secondary300 },
  blueText: { fontWeight: "bold", color: Colors.secondary },
  grayText: { color: Colors.secondary },
  problemImage: { width: 64, height: 64, borderRadius: 8 },
  noImage: {
    backgroundColor: Colors.primary300,
    justifyContent: "center",
    alignItems: "center",
  },
  noProviderContainer: {
    padding: 16,
    backgroundColor: Colors.primary300,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  noProviderText: {
    color: Colors.secondary,
    textAlign: "center",
    fontWeight: "500",
  },
});
