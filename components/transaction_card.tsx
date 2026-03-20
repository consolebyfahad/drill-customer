import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";

interface TransactionCardProps {
  type: string;
  amount: number;
  positive: boolean;
  card?: string;
  time: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  amount,
  positive,
  card,
  time,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Ionicons
          name={positive ? "add-circle" : "cart"}
          size={24}
          color={Colors.secondary}
          style={styles.icon}
        />
        <View>
          <Text style={styles.typeText}>
            {type} {card && `(${card})`}
          </Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.amountText,
          positive ? styles.positive : styles.negative,
        ]}
      >
        {positive ? `SAR${amount}` : `-SAR${amount}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: s(14), paddingVertical: vs(14), backgroundColor: "#F3F4F6", borderRadius: ms(8), marginVertical: vs(7) },
  infoContainer: { flexDirection: "row", alignItems: "center", gap: s(10) },
  icon: { backgroundColor: "white", borderRadius: ms(8), padding: s(8) },
  typeText: { fontSize: ms(15), fontFamily: FONTS.semiBold, color: Colors.secondary },
  timeText: { fontSize: ms(12), color: "#9CA3AF", fontFamily: FONTS.medium },
  amountText: { fontSize: ms(16), fontFamily: FONTS.medium },
  positive: { color: "#10B981" },
  negative: { color: "#EF4444" },
});

export default TransactionCard;
