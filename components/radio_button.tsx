import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "~/constants/Colors";
import { ms, s } from "~/utils/responsive";

interface RadioButtonProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  options,
  selectedOption,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={styles.optionContainer}
          onPress={() => onSelect(option)}
        >
          <View
            style={[
              styles.radioCircle,
              selectedOption === option && styles.selected,
            ]}
          >
            {selectedOption === option && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.label}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: s(18) },
  optionContainer: { flexDirection: "row", alignItems: "center" },
  radioCircle: { height: s(20), width: s(20), borderRadius: ms(10), borderWidth: 2, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  selected: { borderColor: Colors.secondary },
  innerCircle: { height: s(10), width: s(10), borderRadius: ms(5), backgroundColor: Colors.secondary },
  label: { marginLeft: s(7), fontSize: ms(15), color: Colors.secondary },
});

export default RadioButton;
