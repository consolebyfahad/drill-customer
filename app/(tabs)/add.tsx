import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";

import CategoryCard from "~/components/category_card";
import { apiCall } from "~/utils/api";
import Header from "~/components/header";
import { Colors } from "~/constants/Colors";

type Category = {
  id: string;
  image: string;
  name: string;
};

export default function Add() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("type", "get_data");
        formData.append("table_name", "categories");

        const response = await apiCall(formData);
        if (response.data) {
          const mappedCategories = response.data.map((item: any) => ({
            id: item.id,
            image: item.thumb,
            name: item.name,
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

  const handleBooking = (category: Category) => {
    router.push({
      pathname: "/booking",
      params: { id: category.id, name: category.name, image: category.image },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header title="Categories" icon />
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryCard item={item} onPress={() => handleBooking(item)} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
