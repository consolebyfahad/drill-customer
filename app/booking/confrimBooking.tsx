import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Stepper from "@/components/stepper";
import Button from "@/components/button";
import Seprator from "@/components/seprator";
import DashedSeparator from "@/components/dashed_seprator";
import SelectedService from "@/components/selected_service";
import SelectedLocation from "@/components/selected_location";
import SelectedImage from "@/components/selected_image";
import SelectedDescription from "@/components/selected_description";
import Header from "~/components/header";
import { Colors } from "~/constants/Colors";
import { apiCall } from "~/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type BookingParams = {
  id: string;
  name: string;
  image: string;
  location: string;
  latitude?: string;
  longitude?: string;
  selectedImage?: string;
  description?: string;
  packageId?: string;
  packageName?: string;
  packageHours?: string;
  packagePrice?: string;
  paymentMethod?: string;
  paymentMethodDetails?: string;
};

export default function ConfirmBooking() {
  const params = useLocalSearchParams() as BookingParams;
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoValid, setIsPromoValid] = useState(false);

  // Calculate price details
  const packagePrice = Number(params.packagePrice || 200);
  const taxRate = 0.02; // 2% tax
  const tax = packagePrice * taxRate;
  const subTotal = packagePrice;
  const totalAmount = packagePrice + tax - discount;

  const handleVerifyPromoCode = async () => {
    try {
      const formData = new FormData();
      formData.append("type", "verify_promo");
      formData.append("promo_code", promoCode);

      const response = await apiCall(formData);
      if (response.status === "success") {
        setDiscount(response.discount || 10);
        setIsPromoValid(true);
        Alert.alert("Success", "Promo code applied successfully!");
      } else {
        setDiscount(0);
        setIsPromoValid(false);
        Alert.alert("Error", "Invalid promo code");
      }
    } catch (error) {
      console.error("Promo verification error:", error);
      Alert.alert("Error", "Failed to verify promo code");
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const formData = new FormData();
      formData.append("type", "add_data");
      formData.append("table_name", "orders");
      formData.append("user_id", userId);
      formData.append("cat_id", params.id);
      formData.append("address", params.location);
      formData.append("lat", params.latitude || "");
      formData.append("lng", params.longitude || "");
      formData.append("date", new Date().toISOString());
      formData.append("images", params.selectedImage || "");
      formData.append("description", params.description || "");
      formData.append("package_id", params.packageId || "");
      formData.append("payment_method", params.paymentMethod || "");
      formData.append("method_details", params.paymentMethodDetails || "");
      formData.append("promo_code", isPromoValid ? promoCode : "");

      const response = await apiCall(formData);

      if (response.result) {
        console.log("Booking Order response==>", response);
        await AsyncStorage.setItem("order_id", JSON.stringify(response.id));
        router.push("/booking/confrimedBooking");
      } else {
        Alert.alert(
          "Booking Failed",
          response.message || "Unable to process booking"
        );
      }
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Error", "Failed to confirm booking");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Header backBtn={true} title="Confirm Booking" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Stepper step={true} />

          <SelectedService
            category={{
              name: params.name,
              image: params.image,
            }}
          />
          <Seprator />

          <SelectedLocation
            category={{
              id: params.id,
              name: params.name,
              image: params.image,
            }}
            selectedLocation={params.location}
            disabled={true}
          />
          <Seprator />

          <SelectedImage selectedImage={params.selectedImage} disabled={true} />
          <Seprator />

          <SelectedDescription
            description={params.description}
            disabled={true}
          />
          <Seprator />

          {/* Selected Package */}
          <Text style={styles.sectionTitle}>Selected Package</Text>
          <View style={styles.packageContainer}>
            <View>
              <Text style={styles.packageTitle}>{params.packageName}</Text>
              <Text style={styles.packageSubtitle}>
                {params.packageHours} hours package
              </Text>
            </View>
            <Text style={styles.packagePrice}>SAR {packagePrice}</Text>
          </View>

          <Seprator />

          {/* Selected Payment Method */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentText}>{params.paymentMethod}</Text>
            <Ionicons name="checkmark-circle" size={20} color="blue" />
          </View>

          <Seprator />

          {/* Promo Code Input */}
          <Text style={styles.sectionTitle}>Add Promo Code</Text>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            {/* <TouchableOpacity
              style={styles.applyButton}
              onPress={handleVerifyPromoCode}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity> */}
          </View>

          {/* Price Details */}
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceContainer}>
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Price</Text>
              <Text style={styles.boldText}>SAR {subTotal}</Text>
            </View>
            <DashedSeparator />
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Tax (2%)</Text>
              <Text style={styles.boldText}>SAR {tax.toFixed(2)}</Text>
            </View>
            {isPromoValid && (
              <>
                <DashedSeparator />
                <View style={styles.rowBetween}>
                  <Text style={styles.grayText}>Discount</Text>
                  <Text style={styles.discountText}>-SAR {discount}</Text>
                </View>
              </>
            )}
            <DashedSeparator />
            <View style={styles.rowBetween}>
              <Text style={styles.grayText}>Total Amount</Text>
              <Text style={styles.primaryText}>
                SAR {totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Confirm Button */}
        <Button title="Confirm Booking" onPress={handleConfirmBooking} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  innerContainer: { flex: 1, padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
    color: Colors.secondary,
  },
  packageContainer: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packageTitle: { fontSize: 16, fontWeight: "500", color: Colors.secondary },
  packageSubtitle: { color: "gray" },
  packagePrice: { fontSize: 16, fontWeight: "500", color: Colors.secondary },
  paymentContainer: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentText: { fontSize: 16 },
  separator: { height: 1, backgroundColor: "gray", marginVertical: 16 },
  promoContainer: {
    flexDirection: "row",
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  promoInput: { flex: 1 },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyButtonText: { color: "white" },
  priceContainer: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  grayText: { color: "gray" },
  boldText: { fontWeight: "500", color: Colors.secondary },
  discountText: { fontWeight: "500", color: "red" },
  primaryText: { fontWeight: "500", color: "#007AFF" },
});
