import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";

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
  card: { flexDirection: "row", gap: s(14), borderBottomWidth: 1, borderBottomColor: Colors.gray, paddingVertical: vs(16) },
  iconContainer: { padding: s(8), backgroundColor: Colors.primary200, height: s(40), width: s(40), borderRadius: ms(20), justifyContent: "center", alignItems: "center" },
  textContainer: { flex: 1, gap: vs(8) },
  title: { color: Colors.secondary, fontFamily: FONTS.bold, fontSize: ms(14) },
  message: { color: Colors.secondary300, fontSize: ms(13), fontFamily: FONTS.regular },
  dateTime: { color: Colors.secondary300, fontSize: ms(12), fontFamily: FONTS.regular },
});

export default NotificationCard;
