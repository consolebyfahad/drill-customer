import React, { useState, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "@/components/button";
import Stepper from "@/components/stepper";
import SelectedService from "@/components/selected_service";
import Seprator from "@/components/seprator";
import SelectedLocation from "@/components/selected_location";
import SelectedImage from "@/components/selected_image";
import SelectedDescription from "@/components/selected_description";
import Header from "@/components/header";
import { Colors } from "~/constants/Colors";

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Initialize state with parameters from route or previous screen
  const [serviceDetails, setServiceDetails] = useState({
    id: params.id as string,
    name: params.name as string,
    image: params.image as string,
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
    if (params.categoryId && params.categoryName && params.categoryImage) {
      setServiceDetails({
        id: params.categoryId as string,
        name: params.categoryName as string,
        image: params.categoryImage as string,
      });
    }
  }, [params.categoryId, params.categoryName, params.categoryImage]);

  // Effect to log and verify state preservation
  useEffect(() => {
    console.log("Booking Screen State:", {
      serviceDetails,
      selectedLocation,
      selectedImage,
      description,
    });
  }, [serviceDetails, selectedLocation, selectedImage, description]);

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
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <Header backBtn={true} title="Book Service" />
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
            onSelectLocation={setSelectedLocation}
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
        <Button title="Next" onPress={handleNext} />
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
