import Arrow from "@/assets/svgs/arrowLeft.svg";
import Button from "@/components/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "~/contexts/AuthContext";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { apiCall } from "~/utils/api";
import {
  getFCMToken,
  requestFCMPermission,
  setupNotificationListeners,
} from "~/utils/notification";

export default function AccessLocation() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { setUser, getPendingBooking, clearPendingBooking } = useAuth();

  const getDeviceInfo = async () => {
    try {
      let deviceModel = "unknown";
      if (Device.modelName) {
        deviceModel = Device.modelName;
      }

      return {
        platform: Platform.OS || "",
        model: deviceModel,
      };
    } catch (error) {
      console.error("Error getting device info:", error);
      return {
        platform: Platform.OS || "",
        model: "unknown",
        brand: "unknown",
        osVersion: "unknown",
      };
    }
  };

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        if (!userId) {
          return;
        }
        const permissionGranted = await requestFCMPermission();
        if (permissionGranted) {
          const token = await getFCMToken();
          const deviceInfo = await getDeviceInfo();
          const formData = new FormData();
          formData.append("type", "update_noti");
          formData.append("user_id", userId);
          formData.append("devicePlatform", deviceInfo.platform);
          formData.append("deviceRid", token || "");
          formData.append("deviceModel", deviceInfo.model);
          try {
            const response = await apiCall(formData);
          } catch (error) {
            console.error("FCM registration failed:", error);
          }
        }
      } catch (error) {
        console.error("Error setting up notifications:", error);
      }
    };

    const handleNotificationPress = (data: any) => {
    };

    setupNotifications();

    const unsubscribe = setupNotificationListeners(handleNotificationPress);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          t("accessLocation.permissionDenied"),
          t("accessLocation.permissionRequired")
        );
        setLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await AsyncStorage.setItem("latitude", String(latitude));
      await AsyncStorage.setItem("longitude", String(longitude));

      const userId = await AsyncStorage.getItem("user_id");
      if (userId) await setUser(userId);

      const pending = await getPendingBooking();
      if (pending) {
        await clearPendingBooking();
        if (pending.entry === "serviceType") {
          router.replace({
            pathname: "/booking/serviceType",
            params: { id: pending.id, name: pending.name, image: pending.image },
          });
        } else {
          router.replace({
            pathname: "/booking",
            params: { id: pending.id, name: pending.name, image: pending.image },
          });
        }
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert(t("accessLocation.error"), t("accessLocation.errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/auth/verified")}>
          <Arrow />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t("accessLocation.headerTitle")}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Image & Text Content */}
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/location.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{t("accessLocation.title")}</Text>
          <Text style={styles.subtitle}>{t("accessLocation.subtitle")}</Text>
        </View>
        <Text style={styles.disclosure}>
          {t("accessLocation.dataDisclosure")}{" "}
          <Text
            style={styles.privacyLink}
            onPress={() => router.push("/auth/privacy")}
          >
            {t("accessLocation.privacyPolicy")}
          </Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={
            loading
              ? t("accessLocation.loading")
              : t("continue")
          }
          onPress={handleLocation}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 32,
  },
  headerText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: "center",
    color: Colors.secondary,
  },
  content: {
    alignItems: "center",
    marginBottom: 80,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    color: Colors.secondary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.secondary,
    marginBottom: 16,
    fontFamily: FONTS.medium,
  },
  disclosure: {
    fontSize: 13,
    textAlign: "center",
    color: Colors.secondary300,
    paddingHorizontal: 16,
    fontFamily: FONTS.regular,
  },
  privacyLink: {
    color: Colors.primary,
    fontFamily: FONTS.semiBold,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
});
