import AccountIcon from "@/assets/svgs/profileIcon.svg";
import Header from "@/components/header";
import NotificationCard from "@/components/notification_card";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

type Notification = {
  icon: React.ReactNode;
  message: string;
  title: string;
  dateTime: string;
};

export default function NotificationScreen() {
  const { t } = useTranslation();

  // Notifications would be loaded from API in production; empty state for completeness
  const notifications: Notification[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header backBtn={true} title={t("notifications")} />
        <View style={styles.notificationList}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <AccountIcon width={64} height={64} fill={Colors.gray300} />
              <Text style={styles.emptyTitle}>{t("notification.noNotifications")}</Text>
              <Text style={styles.emptySubtitle}>{t("notification.noNotificationsMessage")}</Text>
            </View>
          ) : (
            notifications.map((notification, index) => (
              <NotificationCard
                key={index}
                icon={notification.icon}
                title={notification.title}
                message={notification.message}
                dateTime={notification.dateTime}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  notificationList: {
    marginTop: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: Colors.secondary,
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: Colors.secondary300,
    marginTop: 8,
    textAlign: "center",
  },
});
