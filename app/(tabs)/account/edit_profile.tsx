import DOB from "@/assets/svgs/profile/Calendar.svg";
import Phone from "@/assets/svgs/profile/Call.svg";
import City from "@/assets/svgs/profile/Global.svg";
import Address from "@/assets/svgs/profile/location.svg";
import Email from "@/assets/svgs/profile/Sms.svg";
import Zip from "@/assets/svgs/profile/zip.svg";
import Profile from "@/assets/svgs/profileIcon.svg";
import Header from "@/components/header";
import Inputfield from "@/components/inputfield";
import Seprator from "@/components/seprator";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "~/components/button";
import { apiCall } from "~/utils/api";

type User = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  city: string;
  zip: string;
  image: string;
  verified?: boolean;
};

export default function EditProfile() {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    zip: "",
    image: "",
    verified: false,
  });

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (!storedUserId) throw new Error("User ID not found");

      setUserId(storedUserId);
      const formData = new FormData();
      formData.append("type", "profile");
      formData.append("user_id", storedUserId);

      const response = await apiCall(formData);
      if (response.profile) {
        const profileData = response.profile;
        setUser({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          dob: profileData.dob !== "0000-00-00" ? profileData.dob : "",
          address: profileData.address || "",
          city: profileData.city || "",
          zip: profileData.postal || "",
          image: profileData.image || "",
        });
      } else {
        throw new Error(response.message || "Failed to load profile.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (source: "camera" | "gallery") => {
    let result;

    try {
      const permissionStatus =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionStatus.status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera or Gallery access is required."
        );
        return;
      }

      result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 1,
            });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        setSelectedImage(selectedUri);
        await handleImageUpdate(selectedUri);
      }
    } catch (error) {
      Alert.alert(
        "Image Picker Error",
        "Something went wrong while picking the image."
      );
    }
  };

  const handleImageUpdate = async (imageUri: string) => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      return;
    }

    try {
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
        setUser((prevUser) => ({
          ...prevUser,
          image: response.file_name,
        }));
        Alert.alert("Success", "Profile image updated successfully!");
      } else {
        throw new Error(response.message || "Failed to upload image.");
      }
    } catch (err: any) {
      Alert.alert("Upload Error", err.message || "Something went wrong.");
    }
  };

  const openImagePicker = () => {
    Alert.alert("Select Option", "Choose an option:", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      setError(null);
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(user.dob);

      if (user.dob && !isValidDate) {
        Alert.alert("Invalid Date", "DOB must be in YYYY-MM-DD format.");
        return;
      }

      if (!userId) throw new Error("User ID not found");

      const imageName = user.image?.split("/").pop() || "";

      const formData = new FormData();
      formData.append("type", "update_data");
      formData.append("table_name", "users");
      formData.append("id", userId);
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("dob", user.dob);
      formData.append("address", user.address);
      formData.append("city", user.city);
      formData.append("postal", user.zip);
      if (imageName) formData.append("image", imageName);

      const response = await apiCall(formData);

      if (response.result) {
        await AsyncStorage.setItem("user_name", user.name);
        router.push("/(tabs)/account");
      } else {
        throw new Error(response.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Header title="Edit Profile" backBtn />
        {loading ? (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={openImagePicker}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={
                      selectedImage
                        ? { uri: selectedImage }
                        : user.image
                        ? { uri: user.image }
                        : require("~/assets/images/default-profile.png")
                    }
                    style={styles.profileImage}
                  />
                  <View style={styles.imageIconWrapper}>
                    <Ionicons name="camera" size={16} color={Colors.primary} />
                  </View>
                </View>
              </TouchableOpacity>
              <Text style={styles.userName}>{user.name || "N/A"}</Text>
              <Text style={styles.userEmail}>{user.email || "N/A"}</Text>
            </View>

            <Seprator />

            <Inputfield
              label="Full Name"
              placeholder="Enter your name"
              IconComponent={<Profile />}
              value={user.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
            <Inputfield
              label="Phone Number"
              placeholder="Enter your phone"
              IconComponent={<Phone />}
              value={user.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
            <Inputfield
              label="Email Address"
              placeholder="Enter your email"
              IconComponent={<Email />}
              value={user.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
            <Inputfield
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              IconComponent={<DOB />}
              value={user.dob}
              onChangeText={(text) => handleInputChange("dob", text)}
            />
            <Inputfield
              label="Address"
              placeholder="Enter your address"
              IconComponent={<Address />}
              value={user.address}
              onChangeText={(text) => handleInputChange("address", text)}
            />

            <View style={styles.rowContainer}>
              <View style={styles.flexItem}>
                <Inputfield
                  label="City"
                  placeholder="Enter city"
                  IconComponent={<City />}
                  value={user.city}
                  onChangeText={(text) => handleInputChange("city", text)}
                />
              </View>
              <View style={styles.flexItem}>
                <Inputfield
                  label="Zip Code"
                  placeholder="Enter zip code"
                  IconComponent={<Zip />}
                  value={user.zip}
                  maxLength={6}
                  onChangeText={(text) => handleInputChange("zip", text)}
                />
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
            <Button onPress={handleUpdate} title="Update" />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: "white" },
  scrollContainer: { paddingBottom: 100 },
  loadingScreen: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileContainer: { alignItems: "center" },
  imageWrapper: {
    borderWidth: 2,
    borderColor: Colors.success,
    borderRadius: 999,
    position: "relative",
  },
  profileImage: { height: 96, width: 96, borderRadius: 999 },
  imageIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    height: 24,
    width: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  userName: {
    fontSize: 24,
    fontWeight: "500",
    color: Colors.secondary,
    marginTop: 12,
  },
  userEmail: { color: Colors.secondary300 },
  rowContainer: { flexDirection: "row", paddingBottom: 12, gap: 16 },
  flexItem: { flex: 1 },
  errorText: { color: "red", textAlign: "center", marginTop: 10 },
});
