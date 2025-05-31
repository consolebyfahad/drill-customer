import Camera from "@/assets/svgs/camera.svg";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FONTS } from "~/constants/Fonts";
import { apiCall } from "~/utils/api";

type Props = {
  onSelectImage?: (fileName: string) => void;
  selectedImage?: string;
  disabled?: boolean;
};

export default function SelectedImage({
  onSelectImage,
  selectedImage,
  disabled = false,
}: Props) {
  const [localImage, setLocalImage] = useState<string | null>(
    selectedImage || null
  );
  const { t } = useTranslation();

  const BASE_URL = "https://7tracking.com/saudiservices/images/";

  const getDisplayImageUri = () => {
    if (!localImage) return null;
    if (localImage.startsWith("file://")) {
      return localImage;
    } else {
      return BASE_URL + localImage;
    }
  };

  const pickImage = async (source: "camera" | "gallery") => {
    if (disabled) return;

    let result;
    try {
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissions", "Camera permission is required.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissions", "Gallery permission is required.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
      }

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setLocalImage(imageUri);
        uploadImageToServer(imageUri);
      }
    } catch (error) {
      console.error("Image pick error:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const openImagePicker = () => {
    if (disabled) return;

    Alert.alert("Select Option", "Choose an option:", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const uploadImageToServer = async (imageUri: string) => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) throw new Error("User ID not found");

      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("type", "upload_data");
      formData.append("user_id", userId);
      formData.append("file", {
        uri: imageUri,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      const response = await apiCall(formData);

      if (response.result && response.file_name) {
        if (onSelectImage) {
          onSelectImage(response.file_name);
        }
        // Alert.alert("Success");
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  const displayImage = getDisplayImageUri();

  console.log("localimage", localImage);

  return (
    <>
      <Text style={styles.title}>{t("booking.uploadpicture")}</Text>
      <TouchableOpacity
        onPress={openImagePicker}
        style={styles.uploadContainer}
        disabled={disabled}
      >
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.image} />
        ) : (
          <View style={styles.iconWrapper}>
            <Camera />
          </View>
        )}
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {displayImage
            ? "Image Selected"
            : "Upload the picture here where you want this service."}
        </Text>
      </TouchableOpacity>
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
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 10,
    opacity: 1,
  },
  iconWrapper: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "white",
  },
  text: {
    marginLeft: 16,
    color: Colors.secondary300,
    flex: 1,
  },
  disabledText: {
    color: Colors.secondary,
    opacity: 0.5,
  },
  disabledInfoText: {
    color: Colors.secondary300,
    fontSize: 12,
    marginTop: 8,
    fontFamily: FONTS.regular,
    textAlign: "center",
  },
});
