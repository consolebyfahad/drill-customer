import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import Edit from "@/assets/svgs/edit.svg";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

type Category = {
  image: any;
  name: any;
};
type Props = {
  category: Category;
};

export default function SelectedService({ category }: Props) {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const handleSelectService = () => {
    router.push("/add");
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.image }} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{category.name}</Text>
        <Text style={styles.date}>
          Date: <Text style={styles.dateValue}>{currentDate}</Text>
        </Text>
      </View>
      <TouchableOpacity onPress={handleSelectService}>
        <Edit />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    padding: 8,
    backgroundColor: Colors.primary200,
    borderRadius: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    color: Colors.secondary,
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: Colors.secondary300,
  },
  dateValue: {
    fontSize: 14,
    color: Colors.secondary,
  },
});
