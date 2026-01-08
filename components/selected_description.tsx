import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FONTS } from "~/constants/Fonts";

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
  const { t } = useTranslation();

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
      <Text style={styles.title}>{t("booking.discribeproblem")}</Text>
      {disabled ? (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {description || t("noDescription")}
          </Text>
        </View>
      ) : (
        <TextInput
          style={styles.input}
          placeholder={t("enterDescription")}
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
    fontFamily: FONTS.semiBold,
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
    // justifyContent: "center",
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
