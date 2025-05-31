import AccountIcon from "@/assets/svgs/profileIcon.svg";
import Header from "@/components/header";
import NotificationCard from "@/components/notification_card";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Notification = {
  icon: React.ReactNode;
  message: string;
  title: string;
  dateTime: string;
};

const notifications: Notification[] = [
  {
    icon: <AccountIcon width={24} height={24} fill="#000" />,
    title: "Account Created",
    message: "Your account has been successfully created.",
    dateTime: "05 Jan 2023 | 10:00 AM",
  },
];

export default function NotificationScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header backBtn={true} title={t("notifications")} />
        <View style={styles.notificationList}>
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              icon={notification.icon}
              title={notification.title}
              message={notification.message}
              dateTime={notification.dateTime}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  notificationList: {
    marginTop: 12,
  },
});
