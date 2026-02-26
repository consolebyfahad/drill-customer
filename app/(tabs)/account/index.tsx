import defaultProfile from "@/assets/images/default-profile.png";
import Rating from "@/assets/svgs/emptyStar.svg";
import About from "@/assets/svgs/info.svg";
import Language from "@/assets/svgs/language.svg";
import Logout from "@/assets/svgs/Logout.svg";
import Card from "@/assets/svgs/profile/Card.svg";
import AccountStatus from "@/assets/svgs/profile/security.svg";
import Support from "@/assets/svgs/profile/support.svg";
import Wallet from "@/assets/svgs/profile/Wallet.svg";
import Verify from "@/assets/svgs/verify.svg";
import Button from "@/components/button";
import Header from "@/components/header";
import Seprator from "@/components/seprator";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import i18n from "i18next";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { contentContainerStyle } from "~/constants/Layout";
import { FONTS } from "~/constants/Fonts";
import { APP_STORE_ID } from "~/config";
import { apiCall } from "~/utils/api";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  zip: string;
  image: string;
  balance: string;
  country: string;
  gender: string;
  lat: string;
  lng: string;
  state: string;
  status: string;
  timestamp: string;
  user_type: string;
  online_status?: string;
};

export default function Account() {
  const { t } = useTranslation();
  const router = useRouter();
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
    balance: "",
    country: "",
    gender: "",
    lat: "",
    lng: "",
    state: "",
    status: "",
    timestamp: "",
    user_type: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const userId = await AsyncStorage.getItem("user_id");
        setIsLoggedIn(!!userId);
        if (userId) fetchUserProfile();
      };
      init();
    }, [])
  );

  const fetchUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) return;

      const formData = new FormData();
      formData.append("type", "profile");
      formData.append("user_id", userId);

      const response = await apiCall(formData);

      if (response.profile || response.user) {
        const profileData = response.profile || response.user;
        setUser(profileData);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const handleNavigation = (key: string) => {
    switch (key) {
      case "wallet":
        router.push("/account/wallet");
        break;
      case "card":
        router.push("/account/card_list");
        break;
      case "rateUs": {
        const storeUrl =
          Platform.OS === "ios"
            ? APP_STORE_ID
              ? `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`
              : null
            : "market://details?id=sa.com.drill.app";
        if (storeUrl) Linking.openURL(storeUrl).catch(() => {});
        break;
      }
      case "aboutApp":
        router.push("/account/about");
        break;
      case "language":
        router.push("/account/language");
        break;
      case "support":
        router.push("/account/support");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t("account.logoutConfirmation"), // This is the message
      "", // No title
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("logout"),
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              router.replace("/welcome");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert(
                t("account.logoutErrorTitle"),
                t("account.logoutErrorMessage")
              );
            }
          },
        },
      ]
    );
  };

  const handleProfile = () => {
    router.push("/account/view_profile");
  };

  const handleEditProfile = () => {
    router.push("/account/edit_profile");
  };

  const iconMap: Record<string, React.ReactNode> = {
    Account: <AccountStatus />,
    Wallet: <Wallet />,
    Card: <Card />,
    "Rate Us": <Rating />,
    "About App": <About />,
    Language: <Language />,
    Support: <Support />,
    Logout: <Logout />,
  };
  console.log(t("language"));
  const menuItems = [
    {
      icon: "Account",
      key: "accountStatus",
      title: t("account.accountStatus"),
      right:
        user.status === "1" ? t("account.verified") : t("account.unverified"),
      rightColor: user.status === "1" ? Colors.success : Colors.danger,
    },
    {
      icon: "Wallet",
      key: "wallet",
      title: t("account.wallet"),
      extraRight: "chevron-forward",
    },
    {
      icon: "Card",
      key: "card",
      title: t("account.card"),
      right: "5",
      extraRight: "chevron-forward",
    },
    {
      icon: "Rate Us",
      key: "rateUs",
      title: t("account.rateUs"),
      extraRight: "chevron-forward",
    },
    {
      icon: "About App",
      key: "aboutApp",
      title: t("account.aboutApp"),
      extraRight: "chevron-forward",
    },
    {
      icon: "Language",
      key: "language",
      title: t("account.language"),
      right: t(`language.${i18n.language}`),
      extraRight: "chevron-forward",
    },
    {
      icon: "Support",
      key: "support",
      title: t("account.support"),
      extraRight: "chevron-forward",
    },
    {
      icon: "Logout",
      key: "logout",
      title: t("account.logout"),
      extraRight: "chevron-forward",
    },
  ];

  // Sign-in required for account-based feature (Guideline 5.1.1)
  if (isLoggedIn === false) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={[styles.scrollView, contentContainerStyle]}
          contentContainerStyle={styles.signInPromptContent}
        >
          <Header title={t("account.title")} homeScreen={false} />
          <View style={styles.signInPromptContainer}>
            <Text style={styles.signInPromptText}>
              {t("account.signInToView")}
            </Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.push("/welcome")}
            >
              <Text style={styles.signInButtonText}>{t("login.signIn")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isValidImage = user.image && /\.(jpg|jpeg|png|webp)$/i.test(user.image);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={[styles.scrollView, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Header title={t("account.title")} homeScreen={false} />

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={isValidImage ? { uri: user.image } : defaultProfile}
              style={styles.image}
              resizeMode="cover"
              onError={({ nativeEvent }) => {
                console.warn("Image failed to load", nativeEvent.error);
              }}
            />

            {user.status === "1" && <Verify style={styles.verifiedIcon} />}
            {user.online_status === "1" && (
              <View style={styles.onlineIndicator} />
            )}
          </View>
          <Text style={styles.userName}>
            {user.name ? user.name : t("account.defaultName")}
          </Text>
          <Text style={styles.userEmail}>
            {user.email ? user.email : "member@xyz.com"}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Button
            title={t("account.viewProfile")}
            width="48%"
            fullWidth={false}
            onPress={handleProfile}
          />
          <Button
            title={t("account.editProfile")}
            width="48%"
            fullWidth={false}
            variant="secondary"
            onPress={handleEditProfile}
          />
        </View>

        <Seprator />

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => handleNavigation(item.key)}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  {iconMap[item.icon]}
                  <Text style={styles.itemText}>{item.title}</Text>
                </View>
                <View style={styles.rowRight}>
                  {item.right && (
                    <Text
                      style={[
                        styles.itemRightText,
                        { color: item.rightColor || Colors.secondary300 },
                      ]}
                    >
                      {item.right}
                    </Text>
                  )}
                  {item.extraRight && (
                    <Ionicons
                      name={item.extraRight as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color={Colors.secondary300}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
            {/* )} */}
            <Seprator />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    padding: 16,
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  profileContainer: {
    alignItems: "flex-start",
    marginBottom: 24,
  },
  imageWrapper: {
    borderWidth: 2,
    borderColor: Colors.success,
    borderRadius: 999,
    position: "relative",
  },
  image: {
    width: 96,
    height: 87,
    borderRadius: 999,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.success,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  verifiedIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  userName: {
    fontSize: 24,
    fontFamily: FONTS.extrabold,
    color: Colors.secondary,
    marginTop: 8,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: Colors.secondary300,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: Colors.secondary,
  },
  itemRightText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  signInPromptContent: {
    flex: 1,
    padding: 16,
  },
  signInPromptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  signInPromptText: {
    fontSize: 16,
    color: Colors.secondary100,
    textAlign: "center",
    marginBottom: 24,
    fontFamily: FONTS.medium,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  signInButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
});
