import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { apiCall } from "~/utils/api";
import ServiceCard from "./service_card";
type Service = {
  id: string;
  image: string; // Changed to string for URL
  title: string;
  rating: number;
  reviews: number;
  price: number;
  provider: string;
  providerImage?: string; // Optional since API doesn't provide this
};

type ApiService = {
  id: string;
  image: string;
  name: string;
  rating: number;
  reviews: number;
  price: string;
  company_name: string;
  banners: string;
  status: string;
  timestamp: string;
  translations: string;
};

const PopularServices: React.FC = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const IMAGE_BASE_URL = "https://7tracking.com/saudiservices/images/";

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append("type", "home");
        const response = await apiCall(formData);
        console.log("response", response);

        // Transform API data to match Service type
        if (response?.data) {
          const transformedServices: Service[] = response.data.map(
            (apiService: ApiService) => ({
              id: apiService.id,
              image: `${IMAGE_BASE_URL}${apiService.image}`,
              title: apiService.name,
              rating: apiService.rating || 0,
              reviews: apiService.reviews || 0,
              price: parseFloat(apiService.price) || 0,
              provider: apiService.company_name || "Service Provider",
              providerImage: apiService.banners
                ? `${IMAGE_BASE_URL}${apiService.banners}`
                : undefined,
            })
          );
          setServices(transformedServices);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  if (loading) {
    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{t("popularservices")}</Text>
          {/* <Text style={styles.seeAllText}>See All</Text> */}
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </>
    );
  }

  if (error && services.length === 0) {
    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Popular Services</Text>
          {/* <Text style={styles.seeAllText}>See All</Text> */}
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Popular Services</Text>
        {/* <Text style={styles.seeAllText}>See All</Text> */}
      </View>

      {/* Horizontal Scrollable List */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        renderItem={({ item }) => <ServiceCard item={item} />}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: Colors.secondary,
  },
  seeAllText: {
    color: Colors.primary,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default PopularServices;
