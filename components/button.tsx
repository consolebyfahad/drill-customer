import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "~/constants/Colors";

type ButtonProps = {
  title?: string;
  onPress: () => Promise<void> | void;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  width?: number | string;
  bgColor?: string;
  textColor?: string;
  Icon?: React.ReactNode;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  fullWidth = true,
  width,
  bgColor,
  textColor,
  Icon,
  disabled,
}: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    await onPress();
    setLoading(false);
  };

  const buttonStyle: ViewStyle[] = [
    styles.button,
    fullWidth ? styles.fullWidth : { width: width as any },
    variant === "primary" ? styles.primary : styles.secondary,
  ];

  if (bgColor) {
    buttonStyle.push({ backgroundColor: bgColor });
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          color={textColor || (variant === "primary" ? "#fff" : "#000")}
        />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {Icon ? Icon : ""}
          <Text
            style={[
              styles.text,
              variant === "primary" ? styles.textPrimary : styles.textSecondary,
              textColor && { color: textColor },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.primary300,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  textPrimary: {
    color: "#FFFFFF",
  },
  textSecondary: {
    color: "#333333",
  },
});
