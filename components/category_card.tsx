import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

type CategoryCardProps = {
  item: {
    image: string;
    name: string;
  };
  onPress: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image
        style={styles.image}
        source={{ uri: item.image }}
        resizeMode="contain"
      />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.gray100,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: 110,
    height: 140,
    borderRadius: 16,
  },
  image: {
    height: 56,
    width: 56,
  },
  text: {
    color: Colors.secondary,
    textAlign: "center",
    fontFamily: FONTS.regular,
  },
});

export default CategoryCard;
