import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Colors } from "~/constants/Colors";
import CategoryCard from "@/components/category_card";
import { apiCall } from "~/utils/api";

type Category = {
  id: string;
  image: string;
  name: string;
};

const Categories: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create FormData payload
        const formData = new FormData();
        formData.append("type", "get_data");
        formData.append("table_name", "categories");

        // API request
        const response = await apiCall(formData);
        if (response.data) {
          // Map response to match our Category type
          const mappedCategories = response.data.map((item: any) => ({
            id: item.id,
            image: item.thumb, // Use 'thumb' as the correct image URL
            name: item.name, // Use 'name' instead of 'title'
          }));

          setCategories(mappedCategories);
        } else {
          setError(response.message || "Failed to load categories.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const visibleData = expanded ? categories : categories.slice(0, 6);

  const handleBooking = (category: Category) => {
    router.push({
      pathname: "/booking",
      params: { id: category.id, name: category.name, image: category.image },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        {categories.length > 6 && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.seeAllText}>
              {expanded ? "Show Less" : "See All"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading & Error Handling */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={visibleData}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          nestedScrollEnabled={true}
          renderItem={({ item }) => (
            <CategoryCard item={item} onPress={() => handleBooking(item)} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.secondary,
  },
  seeAllText: {
    color: Colors.primary,
    fontWeight: "500",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Categories;
