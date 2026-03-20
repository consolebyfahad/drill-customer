import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";

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
  title: { fontSize: ms(17), fontFamily: FONTS.semiBold, marginBottom: vs(8), color: Colors.secondary },
  input: { backgroundColor: Colors.primary300, padding: s(14), borderRadius: ms(10), height: vs(120), textAlignVertical: "top", fontSize: ms(14) },
  descriptionContainer: { backgroundColor: Colors.primary300, padding: s(14), borderRadius: ms(10), minHeight: vs(120) },
  descriptionText: { color: Colors.secondary, fontSize: ms(14) },
  disabledText: { color: Colors.secondary300, fontSize: ms(12), marginTop: vs(8), textAlign: "center" },
});
