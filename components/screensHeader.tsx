import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";

type ScreensHeaderProps = {
  title: string;
};

export default function ScreensHeader({ title }: ScreensHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={s(24)} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", marginBottom: vs(20) },
  backButton: { backgroundColor: Colors.gray, padding: s(8), borderRadius: 999 },
  title: { fontSize: ms(22), fontFamily: FONTS.bold, marginLeft: s(14), color: Colors.secondary },
});
