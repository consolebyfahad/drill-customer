import Button from "@/components/button";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS } from "~/constants/Fonts";

export default function LocationScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const mapRef = useRef(null);
  console.log(params);
  const [manualLocation, setManualLocation] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
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

  console.log("selectedLocation", selectedLocation);
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

  // New function to geocode a manual address
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;

    try {
      setSearchingAddress(true);
      const geocode = await Location.geocodeAsync(address);

      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];

        setSelectedLocation({
          address,
          latitude,
          longitude,
        });

        // Animate map to the geocoded location
        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } else {
        Alert.alert(
          "Location Error",
          "Could not find location on map. Please try a different address."
        );
      }
    } catch (error) {
      console.error("Failed to geocode address:", error);
      Alert.alert(
        "Error",
        "Failed to find this address. Please try another one."
      );
    } finally {
      setSearchingAddress(false);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // If we already have coordinates from params, use them
      if (params?.latitude && params?.longitude) {
        const latitude = parseFloat(params.latitude as string);
        const longitude = parseFloat(params.longitude as string);

        setSelectedLocation({
          latitude,
          longitude,
          address: (params?.location as string) || "Fetching address...",
        });

        if (!params?.location) {
          fetchAddressFromCoords(latitude, longitude);
        }

        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        return;
      }

      // Otherwise get current location
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

  const handleRegionChange = (region: Region) => {
    setSelectedLocation({
      latitude: region.latitude,
      longitude: region.longitude,
      address: "Fetching address...",
    });
    fetchAddressFromCoords(region.latitude, region.longitude);
  };

  const centerToUserLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Could not access your current location.");
    }
  };

  const handleManualAddressChange = (text: string) => {
    setSelectedLocation((prev) => ({
      ...prev,
      address: text,
    }));
  };

  const handleSearchAddress = () => {
    if (selectedLocation.address) {
      geocodeAddress(selectedLocation.address);
    }
  };

  const handleConfirm = () => {
    if (
      !selectedLocation.address ||
      !selectedLocation.latitude ||
      !selectedLocation.longitude
    ) {
      Alert.alert("Error", "Please select a valid location");
      return;
    }

    const newParams = { ...params };

    newParams.location = selectedLocation.address;
    newParams.latitude = selectedLocation.latitude.toString();
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

        {manualLocation && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter address manually..."
              value={selectedLocation.address || ""}
              onChangeText={handleManualAddressChange}
              multiline={true}
              numberOfLines={3}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchAddress}
              disabled={searchingAddress || !selectedLocation.address}
            >
              <Text style={styles.searchButtonText}>
                {searchingAddress ? "Searching..." : "Search"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>Selected Address</Text>
          <Text style={styles.addressText}>
            {selectedLocation.address || "No location selected"}
          </Text>
          {selectedLocation.latitude && selectedLocation.longitude && (
            <Text style={styles.coordsText}>
              {`Lat: ${selectedLocation.latitude.toFixed(
                6
              )}, Lng: ${selectedLocation.longitude.toFixed(6)}`}
            </Text>
          )}
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
          disabled={
            !selectedLocation.address ||
            !selectedLocation.latitude ||
            !selectedLocation.longitude
          }
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
  headerText: { fontSize: 24, fontFamily: FONTS.semiBold, color: "#374151" },
  iconButton: { padding: 8 },
  mapContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    height: 450,
  },
  map: { width: "100%", height: "100%" },
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
  addressTitle: { fontSize: 18, fontFamily: FONTS.medium },
  addressText: { color: "#6B7280", marginTop: 4 },
  coordsText: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 12,
    fontStyle: "italic",
  },
  searchContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 8,
    minHeight: 50,
    textAlignVertical: "top",
  },
  searchButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontFamily: FONTS.semiBold,
  },
  buttonContainer: { padding: 16, gap: 8 },
});
