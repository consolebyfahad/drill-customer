import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "~/components/category_card";
import Header from "~/components/header";
import { Colors } from "~/constants/Colors";
import { apiCall } from "~/utils/api";

type Category = {
  id: string;
  image: string;
  name: string;
};

export default function Add() {
  const { t } = useTranslation();
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
          setError(response.message || t("add.failedToLoadCategories"));
        }
      } catch (err) {
        setError(t("add.somethingWentWrong"));
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header title={t("categories")} icon />
        {loading && (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}
        {error && categories.length === 0 && !loading && (
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {!loading && (
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
        )}
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
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
