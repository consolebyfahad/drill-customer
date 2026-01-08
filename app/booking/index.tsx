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
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";

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

  const [serviceType, setServiceType] = useState<"instant" | "schedule">(
    (params.service_type as "instant" | "schedule") || "instant"
  );

  const [scheduleDate, setScheduleDate] = useState<string | null>(
    (params.schedule_date as string) || null
  );

  const [scheduleTime, setScheduleTime] = useState<string | null>(
    (params.schedule_time as string) || null
  );

  const [latlng, setLatlng] = useState({
    latitude: params.latitude as string,
    longitude: params.longitude as string,
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
        latitude: params.latitude as string,
        longitude: params.longitude as string,
      });
    }

    // Update service type and schedule data if passed from categories
    if (params.service_type) {
      setServiceType(params.service_type as "instant" | "schedule");
    }
    if (params.schedule_date) {
      setScheduleDate(params.schedule_date as string);
    }
    if (params.schedule_time) {
      setScheduleTime(params.schedule_time as string);
    }

    // Update other booking data if passed from location screen
    if (params.selectedImage) {
      setSelectedImage(params.selectedImage as string);
    }
    if (params.description) {
      setDescription(params.description as string);
    }
  }, [
    params.categoryId,
    params.categoryName,
    params.categoryImage,
    params.latitude,
    params.longitude,
    params.service_type,
    params.schedule_date,
    params.schedule_time,
    params.selectedImage,
    params.description,
  ]);

  // Effect to log and verify state preservation
  useEffect(() => {
    console.log("Booking Screen State:", {
      serviceDetails,
      selectedLocation,
      selectedImage,
      description,
      latlng,
      serviceType,
      scheduleDate,
      scheduleTime,
    });

    // Debug date parsing
    if (scheduleDate) {
      console.log("Date parsing debug:", {
        scheduleDateString: scheduleDate,
        parsedDate: new Date(scheduleDate),
        parsedDateString: new Date(scheduleDate).toString(),
        parsedDateISO: new Date(scheduleDate).toISOString(),
        localDateString: new Date(scheduleDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    }
  }, [
    serviceDetails,
    selectedLocation,
    selectedImage,
    description,
    latlng,
    serviceType,
    scheduleDate,
    scheduleTime,
  ]);

  const handleNext = () => {
    // Ensure we have lat/lng - use state if params don't have it
    const finalLat = latlng.latitude || params.latitude;
    const finalLng = latlng.longitude || params.longitude;
    
    console.log("📤 Booking Screen - Passing to booking2:", {
      id: serviceDetails.id,
      location: selectedLocation,
      latitude: finalLat,
      longitude: finalLng,
      service_type: serviceType,
    });
    
    router.push({
      pathname: "/booking/booking2",
      params: {
        id: serviceDetails.id,
        name: serviceDetails.name,
        image: serviceDetails.image,
        location: selectedLocation,
        selectedImage,
        description,
        latitude: finalLat,
        longitude: finalLng,
        service_type: serviceType,
        schedule_date: scheduleDate,
        schedule_time: scheduleTime,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.content}>
            {/* Header */}
            <Header backBtn={true} title={t("booking.bookservice")} />
            <Stepper />

            {/* Service Details */}
            <SelectedService
              serviceType={serviceType}
              scheduleDate={scheduleDate || ""}
              scheduleTime={scheduleTime || ""}
              category={{
                name: serviceDetails.name,
                image: serviceDetails.image,
              }}
            />

            {/* Schedule Information - Only show for scheduled services */}
            {/* {serviceType === "schedule" && scheduleDate && scheduleTime && (
              <>
                <View style={styles.scheduleInfoContainer}>
                  <Text style={styles.scheduleInfoTitle}>
                    📅 Scheduled Service
                  </Text>
                  <View style={styles.scheduleInfoRow}>
                    <Text style={styles.scheduleInfoLabel}>Date:</Text>
                    <Text style={styles.scheduleInfoValue}>
                      {new Date(scheduleDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  <View style={styles.scheduleInfoRow}>
                    <Text style={styles.scheduleInfoLabel}>Time:</Text>
                    <Text style={styles.scheduleInfoValue}>
                      {new Date(
                        `2000-01-01T${scheduleTime}`
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </View>
                </View>
                <Seprator />
              </>
            )} */}

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
                  setLatlng({
                    latitude: coordinates.latitude.toString(),
                    longitude: coordinates.longitude.toString(),
                  });
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
      </KeyboardAvoidingView>
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
  scheduleInfoContainer: {
    backgroundColor: Colors.primary300,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scheduleInfoTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: Colors.secondary,
    marginBottom: 12,
  },
  scheduleInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  scheduleInfoLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: Colors.gray,
  },
  scheduleInfoValue: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: Colors.secondary,
  },
});
