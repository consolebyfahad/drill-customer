import ChatSupport from "@/assets/svgs/chatSupport.svg";
import NotificationBell from "@/assets/svgs/Notification.svg";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "~/constants/Colors";

type HeaderProps = {
  userName?: string;
  title?: string;
  homeScreen?: boolean;
  icon?: boolean;
  support?: boolean;
  backBtn?: boolean;
};

export default function Header({
  userName,
  title,
  homeScreen,
  icon,
  support,
  backBtn,
}: HeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();

  const handleNotification = () => {
    router.push("/notification/notification");
  };

  return (
    <View style={styles.container}>
      {/* Left Section (Back Button or Title) */}
      <View style={styles.leftSection}>
        {backBtn === true && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
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
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userName}>👋 {userName}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Right Section (Notification Icon) */}
      {icon &&
        (support ? (
          <TouchableOpacity>
            <ChatSupport width={24} height={24} fill="#000" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleNotification}
            style={styles.notificationButton}
          >
            <NotificationBell width={24} height={24} fill="#000" />
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
    fontWeight: "600",
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
    fontWeight: "600",
    color: Colors.secondary,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.secondary100,
  },
  notificationButton: {
    backgroundColor: Colors.gray100,
    padding: 12,
    borderRadius: 50,
  },
});
