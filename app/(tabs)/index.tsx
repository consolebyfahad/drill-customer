import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Banner from "@/components/banner";
import Header from "@/components/header";
import Search from "@/components/search";
import Categories from "@/sections/categories";
import { Colors } from "~/constants/Colors";

const Home = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAsyncStorageData = async () => {
        try {
          // Get user name
          const storedUserName = await AsyncStorage.getItem("user_name");
          if (storedUserName) {
            console.log("User name:", storedUserName);
            setUserName(storedUserName);
          } else {
            console.log("No user name found.");
          }

          // Get all AsyncStorage data (for debugging)
          const keys = await AsyncStorage.getAllKeys();
          if (keys.length > 0) {
            const stores = await AsyncStorage.multiGet(keys);
            const allData = stores.map(([key, value]) => ({ key, value }));
            console.log("All AsyncStorage Data:", allData);
          } else {
            console.log("No data found in AsyncStorage.");
          }
        } catch (error) {
          console.error("Failed to fetch AsyncStorage data:", error);
        }
      };

      fetchAsyncStorageData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Header userName={userName ?? "Dear User"} homeScreen icon />
        <Banner />
        <Search />
        <Categories />
        {/* <PopularServices /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  contentContainer: {
    paddingBottom: 150,
  },
});
