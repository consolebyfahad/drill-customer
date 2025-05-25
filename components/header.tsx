import ChatSupport from "@/assets/svgs/chatSupport.svg";
import NotificationBell from "@/assets/svgs/Notification.svg";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

type HeaderProps = {
  userName?: string;
  title?: string;
  homeScreen?: boolean;
  icon?: boolean;
  support?: boolean;
  backBtn?: boolean;
  onpress?: any;
  backAddress?: any;
};

export default function Header({
  userName,
  title,
  homeScreen,
  icon,
  support,
  backBtn,
  backAddress,
}: HeaderProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleNotification = () => {
    router.push("/notification/notification");
  };
  const handleGoBack = () => {
    if (backAddress) {
      router.push(backAddress);
    } else {
      navigation.goBack();
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {backBtn === true && (
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <AntDesign name="left" size={24} color={Colors.secondary} />
          </TouchableOpacity>
        )}
        {!homeScreen ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <View style={styles.userContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.userImage}
            />
            <View>
              <Text style={styles.welcomeText}>{t("welcome")}</Text>
              <Text style={styles.userName}>👋 {userName}</Text>
            </View>
          </View>
        )}
      </View>

      {icon &&
        (support ? (
          <TouchableOpacity>
            <ChatSupport />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNotification}
            style={styles.notificationButton}
          >
            <NotificationBell />
          </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray100,
    borderRadius: 50,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: Colors.secondary,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: Colors.secondary,
  },
  userName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: Colors.secondary100,
  },
  notificationButton: {
    backgroundColor: Colors.gray100,
    padding: 12,
    borderRadius: 50,
  },
});
