import CurrentLocation from "@/assets/svgs/GPS.svg";
import LocationIcon from "@/assets/svgs/locationIcon.svg";
import SearchIcon from "@/assets/svgs/searchIcon.svg";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

export default function Search() {
  const { t } = useTranslation();

  const handleSearch = () => {
    router.push("/(tabs)/add");
  };

  const handleLocation = () => {
    router.push("/(tabs)/add");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <LocationIcon />
        <TextInput
          placeholder={t("search.allServicesAvailable")}
          placeholderTextColor={Colors.secondary300}
          style={styles.input}
          editable={false}
          onTouchEnd={handleSearch}
          accessibilityLabel={t("search.allServicesAvailable")}
        />
        <TouchableOpacity
          onPress={handleLocation}
          style={styles.locationButton}
          accessibilityRole="button"
          accessibilityLabel={t("search.browseServices")}
        >
          <CurrentLocation />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        accessibilityRole="button"
        accessibilityLabel={t("search.searchServices")}
      >
        <SearchIcon />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.gray100,
    padding: 16,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    color: Colors.secondary100,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  locationButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 12,
  },
});
