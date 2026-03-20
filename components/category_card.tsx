import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";

type CategoryCardProps = {
  item: { image: string; name: string };
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
      <Text style={styles.text} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.gray100,
    padding: s(12),
    alignItems: "center",
    justifyContent: "center",
    gap: vs(8),
    flex: 1,
    minWidth: s(90),
    minHeight: vs(120),
    borderRadius: ms(16),
    marginHorizontal: s(4),
  },
  image: {
    height: s(50),
    width: s(50),
  },
  text: {
    color: Colors.secondary,
    textAlign: "center",
    fontSize: ms(13),
    fontFamily: FONTS.regular,
  },
});

export default CategoryCard;
