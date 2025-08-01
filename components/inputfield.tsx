import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FONTS } from "~/constants/Fonts";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  IconComponent?: React.ReactNode;
  value?: string;
  maxLength?: number;
  onChangeText: (text: string) => void;
  dateFormat?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  IconComponent,
  value,
  maxLength,
  onChangeText,
  dateFormat = false,
}) => {
  const handleTextChange = (text: string) => {
    if (dateFormat) {
      // Remove all non-digits
      const sanitizedText = text.replace(/[^0-9]/g, "");

      // Format as YYYY-MM-DD
      let formattedText = sanitizedText;
      if (sanitizedText.length >= 5) {
        formattedText =
          sanitizedText.slice(0, 4) + "-" + sanitizedText.slice(4);
      }
      if (sanitizedText.length >= 7) {
        formattedText =
          sanitizedText.slice(0, 4) +
          "-" +
          sanitizedText.slice(4, 6) +
          "-" +
          sanitizedText.slice(6, 8);
      }

      // Limit to 10 characters (YYYY-MM-DD)
      formattedText = formattedText.slice(0, 10);
      onChangeText(formattedText);
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {IconComponent && <View>{IconComponent}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.secondary300}
          value={value}
          maxLength={maxLength}
          onChangeText={handleTextChange}
          keyboardType={dateFormat ? "numeric" : "default"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: Colors.secondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary300,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: Colors.secondary,
  },
});

export default InputField;
