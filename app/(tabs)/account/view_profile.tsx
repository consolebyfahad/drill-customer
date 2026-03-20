import Star from "@/assets/svgs/Star.svg";
import LocationIcon from "@/assets/svgs/locationIcon.svg";
import Button from "@/components/button";
import Header from "@/components/header";
import Seprator from "@/components/seprator";
import ServiceDetailsCard from "@/components/service_details_card";
import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";
import { apiCall } from "~/utils/api";

type Order = {
  id: string;
  order_no: string;
  user_id: string;
  cat_id: string;
  cat_name: string;
  to_id: string;
  address: string;
  lat: string;
  lng: string;
  date: string;
  images: string;
  description: string;
  package_id: string;
  package_name: string;
  order_price: string;
  discount: string;
  payment_method: string;
  method_details: string;
  promo_code: string;
  status: string;
  timestamp: string;
  created_at: string;
  distance: number;
  provider: string;
  title?: string;
  amount?: string;
  paymentStatus?: string;
  image?: any;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  zip: string;
  image: string | any;
  balance: string;
  gender: string;
  lat: string;
  lng: string;
  state: string;
  status: string;
  timestamp: string;
  user_type: string;
  online_status: string;
};

export default function ViewProfile() {
  const { t } = useTranslation();
  const [showAllOrders, setShowAllOrders] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    zip: "",
    image: "",
    balance: "0",
    gender: "",
    lat: "",
    lng: "",
    state: "",
    status: "",
    timestamp: "",
    user_type: "",
    online_status: "",
  });

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const fetchOrders = async () => {
    setIsLoading(true);
    const userId = await AsyncStorage.getItem("user_id");

    if (!userId) throw new Error("User ID not found");

    const formData = new FormData();
    formData.append("type", "get_data");
    formData.append("table_name", "orders");
    formData.append("user_id", userId);

    try {
      const response = await apiCall(formData);
      if (response && response.data && response.data.length > 0) {
        // Filter completed orders only
        const completedOrders = response.data.filter(
          (order: any) => order.status?.toLowerCase() === "completed"
        );

        const transformedOrders = completedOrders.map((order: any) => ({
          ...order,
          title: order.cat_name || t("account.service"),
          amount: order.order_price || "0",
          discount: order.discount || "0",
          paymentStatus: order.payment_method || t("unknown"),
          provider:
            order.to_id !== "0"
              ? order.provider || t("account.assignedProvider")
              : t("account.waitingForProvider"),
          image: require("@/assets/images/cleaning_service.png"),
        }));

        setOrders(transformedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
      Alert.alert(t("error"), t("add.somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) throw new Error("User ID not found");
      const formData = new FormData();
      formData.append("type", "profile");
      formData.append("user_id", userId);

      const response = await apiCall(formData);
      if (response.profile || response.user) {
        const profileData = response.profile || response.user;
        setUser({
          id: profileData.id || "",
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          dob: profileData.dob !== "0000-00-00" ? profileData.dob : "",
          address: profileData.address || "",
          city: profileData.city || "",
          zip: profileData.postal || "",
          image: profileData.image || "",
          balance: profileData.balance || "0",
          gender: profileData.gender || "",
          lat: profileData.lat || "",
          lng: profileData.lng || "",
          state: profileData.state || "",
          status: profileData.status || "",
          online_status: profileData.online_status || "",
          timestamp: profileData.timestamp || "",
          user_type: profileData.user_type || "",
        });

        // After getting user profile, fetch orders
        fetchOrders(profileData.id);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleEditProfile = () => {
    router.push("/account/edit_profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Header title={t("account.viewProfile")} backBtn={true} />

        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                typeof user.image === "string" && user.image
                  ? { uri: user.image }
                  : require("@/assets/images/default-profile.png")
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
            {user.online_status === "1" && (
              <View style={styles.onlineIndicator} />
            )}
            {user.status === "1" && (
              <MaterialIcons
                style={styles.verifiedIcon}
                name="verified"
                size={24}
                color="#2AB749"
              />
            )}
          </View>

          <Text style={styles.userName}>
            {user.name || t("account.defaultName")}
          </Text>

          <View style={styles.ratingContainer}>
            <Star />
            <Text style={styles.ratingText}>
              {user?.rating ? user?.rating : "0"}
            </Text>
            <Text style={styles.reviewCount}>
              ({user?.review ? user?.review : "0"})
            </Text>
          </View>

          <Text style={styles.balance}>
            {t("account.balance")}
            {user.balance}
          </Text>
          <Text style={styles.userEmail}>
            {user.email ? user.email : t("account.defaultEmail")}
          </Text>

          <View style={styles.locationContainer}>
            <LocationIcon />
            <Text style={styles.locationText}>
              {user.address || t("account.defaultAddress")} {user.city}
            </Text>
          </View>
        </View>

        <Button
          variant="secondary"
          title={t("account.editProfile")}
          onPress={handleEditProfile}
        />

        <Seprator />

        <TouchableOpacity
          onPress={() => setShowAllOrders(!showAllOrders)}
          style={styles.orderToggle}
        >
          <Text style={styles.orderTitle}>
            {t("account.completedOrders")}{" "}
            <Text style={styles.orderCount}>({orders.length})</Text>
          </Text>
          <Ionicons
            name={showAllOrders ? "chevron-down" : "chevron-forward"}
            size={20}
            color={Colors.secondary}
          />
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          showAllOrders &&
          (orders.length > 0 ? (
            orders.map((order, index) => (
              <ServiceDetailsCard key={index} order={order} />
            ))
          ) : (
            <Text style={styles.noOrdersText}>{t("no_order")}</Text>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContainer: { paddingHorizontal: s(16), paddingTop: vs(8), paddingBottom: vs(120) },
  profileContainer: { alignItems: "flex-start", marginBottom: vs(20) },
  imageWrapper: { borderWidth: 2, borderColor: "green", borderRadius: 999, position: "relative" },
  profileImage: { height: s(88), width: s(88), borderRadius: 999 },
  onlineIndicator: { position: "absolute", bottom: 0, right: 0, backgroundColor: "green", height: s(22), width: s(22), borderRadius: 999, borderWidth: 1, borderColor: "white" },
  verifiedIcon: { position: "absolute", top: 0, right: 0 },
  userName: { fontSize: ms(22), fontFamily: FONTS.bold, color: Colors.secondary, marginTop: vs(10) },
  ratingContainer: { flexDirection: "row", alignItems: "center", gap: s(6) },
  ratingText: { fontFamily: FONTS.medium, color: Colors.secondary, fontSize: ms(14) },
  reviewCount: { color: Colors.gray300, fontSize: ms(12), fontFamily: FONTS.medium },
  balance: { color: Colors.secondary300, fontSize: ms(17), fontFamily: FONTS.medium },
  userEmail: { color: Colors.secondary300, fontSize: ms(14), marginTop: vs(4), fontFamily: FONTS.medium },
  locationContainer: { flexDirection: "row", alignItems: "center", marginTop: vs(7), gap: s(4) },
  locationText: { color: Colors.secondary300, fontSize: ms(14), fontFamily: FONTS.medium },
  orderToggle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderTitle: { fontFamily: FONTS.bold, fontSize: ms(15) },
  orderCount: { fontSize: ms(13), color: Colors.secondary300, fontFamily: FONTS.medium },
  noOrdersText: { textAlign: "center", marginTop: vs(18), color: Colors.secondary300, fontFamily: FONTS.medium, fontSize: ms(14) },
});
