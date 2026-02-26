import Banner from "@/components/banner";
import Header from "@/components/header";
import Search from "@/components/search";
import Categories from "@/sections/categories";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PopularServices from "~/components/popular_services";
import { Colors } from "~/constants/Colors";
import { contentContainerStyle } from "~/constants/Layout";

export default function Home() {
  const { t } = useTranslation();
  const [userName, setUserName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const getUserName = async () => {
        try {
          const storedUserName = await AsyncStorage.getItem("user_name");
          setUserName(storedUserName);
        } catch (error) {
          console.error("Failed to fetch AsyncStorage data:", error);
        }
      };
      getUserName();
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
      <View style={[styles.wrapper, contentContainerStyle]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Header userName={userName ?? t("defaultGreeting")} homeScreen icon />
          <Banner />
          <Search />
          <Categories />
          <PopularServices />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  contentContainer: {
    paddingBottom: 100,
  },
});
