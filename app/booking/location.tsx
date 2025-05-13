import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/button";
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function LocationScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const mapRef = useRef(null);

  const [manualLocation, setManualLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address?: string;
    latitude?: number;
    longitude?: number;
  }>({
    address: (params?.location as string) || "",
    latitude: params?.latitude
      ? parseFloat(params.latitude as string)
      : 37.7749,
    longitude: params?.longitude
      ? parseFloat(params.longitude as string)
      : -122.4194,
  });

  const fetchAddressFromCoords = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (geocode.length > 0) {
        const { name, street, city, region, country } = geocode[0];
        const address = `${name || ""} ${street || ""}, ${city || ""}, ${
          region || ""
        }, ${country || ""}`;
        setSelectedLocation((prev) => ({ ...prev, address }));
      }
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setSelectedLocation({
        latitude,
        longitude,
        address: "Fetching address...",
      });

      fetchAddressFromCoords(latitude, longitude);

      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleRegionChange = (region: {
    latitude: number;
    longitude: number;
  }) => {
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
      address: "Fetching address...",
    });
    fetchAddressFromCoords(region.latitude, region.longitude);
  };

  const centerToUserLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleManualAddressChange = (text: string) => {
    setSelectedLocation((prev) => ({
      ...prev,
      address: text,
      latitude: undefined,
      longitude: undefined,
    }));
  };

  const handleConfirm = () => {
    const newParams = { ...params };

    if (selectedLocation.address) newParams.location = selectedLocation.address;
    if (selectedLocation.latitude)
      newParams.latitude = selectedLocation.latitude.toString();
    if (selectedLocation.longitude)
      newParams.longitude = selectedLocation.longitude.toString();

    router.push({ pathname: "/booking", params: newParams });
  };

  const toggleLocation = () => setManualLocation((prev) => !prev);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Select Location</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={centerToUserLocation}
          >
            <Ionicons name="location-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation.latitude || 37.7749,
              longitude: selectedLocation.longitude || -122.4194,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={true}
            showsMyLocationButton={true}
          />
          {/* Fixed Marker Icon */}
          <Ionicons
            name="location-sharp"
            size={32}
            color={Colors.primary}
            style={styles.markerFixed}
          />
        </View>

        {manualLocation && (
          <TextInput
            style={styles.input}
            placeholder="Enter address manually..."
            value={selectedLocation.address || ""}
            onChangeText={handleManualAddressChange}
            multiline={true}
            numberOfLines={3}
          />
        )}

        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Selected Address</Text>
          <Text style={styles.addressText}>
            {selectedLocation.address || "No location selected"}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={centerToUserLocation}
        style={styles.myLocationButton}
      >
        <Ionicons name="locate" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Button
          title="Confirm Location"
          onPress={handleConfirm}
          disabled={!selectedLocation.address}
        />
        <Button
          variant="secondary"
          textColor={Colors.primary}
          title={manualLocation ? "Use Map Instead" : "Enter Location Manually"}
          onPress={toggleLocation}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  scrollContainer: { padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: { backgroundColor: "#E5E7EB", padding: 8, borderRadius: 50 },
  headerText: { fontSize: 24, fontWeight: "bold", color: "#374151" },
  iconButton: { padding: 8 },
  mapContainer: { borderRadius: 16, overflow: "hidden", marginBottom: 16 },
  map: { width: "100%", height: 400 },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -16,
    marginTop: -32,
    zIndex: 10,
  },
  myLocationButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  addressContainer: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  addressTitle: { fontSize: 18, fontWeight: "bold" },
  addressText: { color: "#6B7280" },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray400,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: { padding: 16, gap: 8 },
});
