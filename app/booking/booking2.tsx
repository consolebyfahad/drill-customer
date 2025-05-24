import Applepay from "@/assets/images/applepay.png";
import Appwallet from "@/assets/images/appwallet.png";
import Cashonpay from "@/assets/images/cop.png";
import Visa from "@/assets/images/visa.png";
import Button from "@/components/button";
import Header from "@/components/header";
import Seprator from "@/components/seprator";
import Stepper from "@/components/stepper";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashedSeparator from "~/components/dashed_seprator";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { apiCall } from "~/utils/api";

interface Package {
  id: string;
  name: string;
  hours: number;
  price: number;
  features?: string[];
}

const paymentMethods = [
  { id: "visa", image: Visa, name: "Visa Card" },
  { id: "apple", image: Applepay, name: "Apple Pay" },
  { id: "wallet", image: Appwallet, name: "App Wallet" },
  { id: "cash", image: Cashonpay, name: "Cash on Pay" },
];

export default function Booking2Screen() {
  const params = useLocalSearchParams();
  console.log("booking2", params);

  // State for packages and selections
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  // Fetch available packages on component mount
  useEffect(() => {
    fetchAvailablePlans();
  }, []);

  const fetchAvailablePlans = async () => {
    try {
      const formData = new FormData();
      formData.append("type", "get_data");
      formData.append("table_name", "plans");

      const response = await apiCall(formData);
      if (response && response.data) {
        // Transform the response to match Package interface
        const transformedPlans = response.data.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          hours: plan.hours,
          price: plan.price,
          features: plan.features ? JSON.parse(plan.features) : [],
        }));
        setPackages(transformedPlans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      Alert.alert("Error", "Unable to fetch service packages");
    }
  };

  const handleNext = () => {
    // Validate package and payment selection
    if (!selectedPackage) {
      Alert.alert("Selection Required", "Please select a service package");
      return;
    }

    if (!selectedPayment) {
      Alert.alert("Selection Required", "Please select a payment method");
      return;
    }

    // Prepare payment method details
    const selectedPaymentMethod = paymentMethods.find(
      (method) => method.id === selectedPayment
    );

    // Navigate to confirm booking with all collected data
    router.push({
      pathname: "/booking/confrimBooking",
      params: {
        // Previous screen data
        id: params.id,
        name: params.name,
        image: params.image,
        location: params.location,
        selectedImage: params.selectedImage,
        description: params.description,
        latitude: params.latitude,
        longitude: params.longitude,

        // Current screen selections
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        packageHours: selectedPackage.hours,
        packagePrice: selectedPackage.price,

        paymentMethod: selectedPaymentMethod?.name || "",
        paymentMethodDetails: selectedPayment,
      },
    });
  };

  const handleAddCard = () => {
    router.push("/booking/addCard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header backBtn={true} title="Book Service" />
          <Stepper step={true} />

          {/* Select Package */}
          <Text style={styles.sectionTitle}>Select Package</Text>
          {packages.map((pkg) => (
            <TouchableOpacity
              key={pkg.id}
              onPress={() => setSelectedPackage(pkg)}
              style={[
                styles.packageCard,
                selectedPackage?.id === pkg.id && styles.selectedPackageCard,
              ]}
            >
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packageDetails}>
                    {pkg.hours} hours package | SAR {pkg.price}
                  </Text>
                </View>
                <View style={styles.radioOuter}>
                  {selectedPackage?.id === pkg.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              {selectedPackage?.id === pkg.id && pkg.features && (
                <>
                  <DashedSeparator />
                  {pkg.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </>
              )}
            </TouchableOpacity>
          ))}

          <Seprator />

          {/* Payment Method */}
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity onPress={handleAddCard}>
              <Text style={styles.addCardText}>Add Card</Text>
            </TouchableOpacity>
          </View>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              style={styles.paymentCard}
            >
              <View style={styles.row}>
                <Image source={method.image} style={styles.paymentImage} />
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
              <View style={styles.radioOuter}>
                {selectedPayment === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title="Later"
            onPress={handleNext}
            variant="secondary"
            fullWidth={false}
            width="29%"
          />
          <Button
            title="Pay Advance"
            onPress={handleNext}
            fullWidth={false}
            width="69%"
            variant="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    marginBottom: 16,
    color: Colors.secondary,
  },
  packageCard: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedPackageCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  packageName: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: Colors.secondary,
  },
  packageDetails: {
    fontSize: 14,
    color: Colors.secondary,
  },
  addCardText: {
    fontSize: 14,
    color: Colors.primary,
  },
  paymentCard: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  paymentImage: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  paymentName: {
    fontSize: 16,
    color: "#333",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#666",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#007AFF",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 6,
  },
  featureText: {
    fontSize: 14,
    color: Colors.secondary,
  },
});
