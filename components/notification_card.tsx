import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "~/constants/Fonts";

type NotificationCardProps = {
  icon: React.ReactNode;
  message: string;
  dateTime: string;
  title: string;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  icon,
  message,
  title,
  dateTime,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.dateTime}>{dateTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingVertical: 20,
  },
  iconContainer: {
    padding: 8,
    backgroundColor: Colors.primary200,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    gap: 12,
  },
  title: {
    color: Colors.secondary,
    fontFamily: FONTS.bold,
  },
  message: {
    color: Colors.secondary300,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  dateTime: {
    color: Colors.secondary300,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
});

export default NotificationCard;
