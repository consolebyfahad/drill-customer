import Button from "@/components/button";
import Header from "@/components/header";
import SelectedDescription from "@/components/selected_description";
import SelectedImage from "@/components/selected_image";
import SelectedLocation from "@/components/selected_location";
import SelectedService from "@/components/selected_service";
import Seprator from "@/components/seprator";
import Stepper from "@/components/stepper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";

export default function BookingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log("params", params);
  const [serviceDetails, setServiceDetails] = useState({
    id: params.id as string,
    name: params.name as string,
    image: params.image as string,
  });

  const [latlng, setLatlng] = useState({
    latitude: params.latitude,
    longitude: params.longitude,
  });

  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    (params.location as string) || null
  );

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    (params.selectedImage as string) || undefined
  );

  const [description, setDescription] = useState<string>(
    (params.description as string) || ""
  );

  useEffect(() => {
    // Check if category details are passed from location screen
    if (
      params.categoryId &&
      params.categoryName &&
      params.categoryImage &&
      params.longitude &&
      params.latitude
    ) {
      setServiceDetails({
        id: params.categoryId as string,
        name: params.categoryName as string,
        image: params.categoryImage as string,
      });
      setLatlng({
        latitude: params.latitude,
        longitude: params.longitude,
      });
    }
  }, [
    params.categoryId,
    params.categoryName,
    params.categoryImage,
    params.latitude,
    params.longitude,
  ]);

  // Effect to log and verify state preservation
  useEffect(() => {
    console.log("Booking Screen State:", {
      serviceDetails,
      selectedLocation,
      selectedImage,
      description,
      latlng,
    });
  }, [serviceDetails, selectedLocation, selectedImage, description, latlng]);

  const handleNext = () => {
    router.push({
      pathname: "/booking/booking2",
      params: {
        id: serviceDetails.id,
        name: serviceDetails.name,
        image: serviceDetails.image,
        location: selectedLocation,
        selectedImage,
        description,
        latitude: params.latitude,
        longitude: params.longitude,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <Header backBtn={true} title={t("booking.bookservice")} />
          <Stepper />

          {/* Service Details */}
          <SelectedService
            category={{
              name: serviceDetails.name,
              image: serviceDetails.image,
            }}
          />
          <Seprator />

          {/* Requested Service Location */}
          <SelectedLocation
            category={{
              id: serviceDetails.id,
              name: serviceDetails.name,
              image: serviceDetails.image,
            }}
            onSelectLocation={(address, coordinates) => {
              setSelectedLocation(address);
              if (coordinates) {
                setLatlng(coordinates);
              }
            }}
            selectedLocation={selectedLocation}
          />
          <Seprator />

          {/* Upload Picture */}
          <SelectedImage
            onSelectImage={setSelectedImage}
            selectedImage={selectedImage}
          />
          <Seprator />

          {/* Describe Your Problem */}
          <SelectedDescription
            onDescriptionChange={setDescription}
            description={description}
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <Button title={t("next")} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  content: {
    padding: 16,
  },
  buttonContainer: {
    padding: 16,
  },
});
