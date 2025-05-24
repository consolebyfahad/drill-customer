import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { BackHandler, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Banner from "@/components/banner";
import Header from "@/components/header";
import Search from "@/components/search";
import Categories from "@/sections/categories";
import PopularServices from "~/components/popular_services";
import { Colors } from "~/constants/Colors";

const Home = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchAsyncStorageData = async () => {
        try {
          const storedUserName = await AsyncStorage.getItem("user_name");
          if (storedUserName) {
            console.log("User name:", storedUserName);
            setUserName(storedUserName);
          } else {
            console.log("No user name found.");
          }

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

      const onBackPress = () => {
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
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
        <PopularServices />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  contentContainer: {
    paddingBottom: 100,
  },
});
