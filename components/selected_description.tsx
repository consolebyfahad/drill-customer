import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";

type Props = {
  onDescriptionChange?: (description: string) => void;
  description?: string;
  disabled?: boolean;
};

export default function SelectedDescription({
  onDescriptionChange,
  description: propDescription,
  disabled = false,
}: Props) {
  const [description, setDescription] = useState(propDescription || "");

  // Update local state if prop changes
  useEffect(() => {
    setDescription(propDescription || "");
  }, [propDescription]);

  const handleChangeText = (text: string) => {
    // Prevent changes if disabled
    if (disabled) return;

    setDescription(text);

    // Only call onDescriptionChange if provided and not disabled
    if (onDescriptionChange && !disabled) {
      onDescriptionChange(text);
    }
  };

  return (
    <>
      <Text style={styles.title}>Describe Your Problem</Text>
      {disabled ? (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {description || "No description provided"}
          </Text>
        </View>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter description here..."
          multiline
          value={description}
          onChangeText={handleChangeText}
          editable={!disabled}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
    color: Colors.secondary,
  },
  input: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 10,
    height: 128,
    textAlignVertical: "top",
  },
  descriptionContainer: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 10,
    minHeight: 128,
    justifyContent: "center",
  },
  descriptionText: {
    color: Colors.secondary,
  },
  disabledText: {
    color: Colors.secondary300,
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
