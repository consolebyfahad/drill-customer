import {
  View,
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "~/components/header";
import { apiCall } from "~/utils/api";
import { Colors } from "~/constants/Colors";
import DashedSeparator from "~/components/dashed_seprator";

interface Package {
  id: string;
  name: string;
  hours: number;
  price: number;
  features?: string[];
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailablePlans();
  }, []);

  const fetchAvailablePlans = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("type", "get_data");
      formData.append("table_name", "plans");

      const response = await apiCall(formData);

      if (response && response.data) {
        const transformedPlans = response.data.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          hours: parseInt(plan.hours) || 0,
          price: parseFloat(plan.price) || 0,
          features: plan.features ? JSON.parse(plan.features) : [],
        }));

        setPackages(transformedPlans);

        if (transformedPlans.length > 0 && !selectedPackage) {
          setSelectedPackage(transformedPlans[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError("Unable to fetch service packages");
      Alert.alert("Error", "Unable to fetch service packages");
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);
  };

  const renderPackageCard = (pkg: Package) => {
    const isSelected = selectedPackage?.id === pkg.id;

    return (
      <TouchableOpacity
        key={pkg.id}
        onPress={() => handlePackageSelect(pkg)}
        style={[styles.packageCard, isSelected && styles.selectedPackageCard]}
        activeOpacity={0.8}
      >
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.packageDetails}>
              {pkg.hours} hours package | SAR {pkg.price.toFixed(2)}
            </Text>
          </View>
          <View style={styles.radioOuter}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>

        {isSelected && pkg.features && pkg.features.length > 0 && (
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
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Packages" icon={true} />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchAvailablePlans}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : packages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No packages available</Text>
          </View>
        ) : (
          <ScrollView>{packages.map(renderPackageCard)}</ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: "center",
  },
  packageCard: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
    fontSize: 18,
    fontWeight: "600",
    color: Colors.secondary,
    marginBottom: 4,
  },
  packageDetails: {
    fontSize: 14,
    color: Colors.secondary,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.secondary,
    flex: 1,
    lineHeight: 20,
  },
});
