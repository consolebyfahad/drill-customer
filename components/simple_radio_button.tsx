import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "~/constants/Colors";

interface SimpleRadioButtonProps {
  selected: boolean;
  onPress: () => void;
  size?: number;
}

const SimpleRadioButton: React.FC<SimpleRadioButtonProps> = ({
  selected,
  onPress,
  size = 24,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.radioCircle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
      onPress={onPress}
    >
      {selected && (
        <View
          style={[
            styles.innerCircle,
            {
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: (size * 0.6) / 2,
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioCircle: {
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    backgroundColor: Colors.primary,
  },
});

export default SimpleRadioButton;
