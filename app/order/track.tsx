import Accepted from "@/assets/svgs/Button.svg";
import OTW from "@/assets/svgs/RecordButton.svg";
import Arrived from "@/assets/svgs/TrackButton.svg";
import Profile from "@/assets/svgs/profile-circle.svg";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Button from "~/components/button";
import Header from "~/components/header";
import ProviderCard from "~/components/provider_card";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { OrderType } from "~/types/dataTypes";
import { apiCall } from "~/utils/api";
type LocationStateType = Location.LocationObject;

export default function Track() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<string>("OnTheWay");
  const slideAnim = useRef(new Animated.Value(800)).current;
  const [location, setLocation] = useState<LocationStateType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOrderLoaded, setIsOrderLoaded] = useState<boolean>(false);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const mapRef = useRef<MapView | null>(null);
  const [order, setOrder] = useState<OrderType | null>(null);
  const params = useLocalSearchParams();
  const orderId = useMemo(
    () => params.orderId?.toString() || "",
    [params.orderId]
  );
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null
  );
  const GOOGLE_MAPS_API_KEY = "AIzaSyAQiilQ_i4LRPFyMhfLB5ZT3UGMTIxqL0Y";

  // Decode Google polyline to coordinates
  const decodePolyline = (
    encoded: string
  ): { latitude: number; longitude: number }[] => {
    const poly = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({
        latitude: lat * 1e-5,
        longitude: lng * 1e-5,
      });
    }
    return poly;
  };

  // Fetch route from Google Directions API
  const fetchRoute = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ) => {
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const polyline = route.overview_polyline.points;
        const decodedCoordinates = decodePolyline(polyline);
        return decodedCoordinates;
      } else {
        return [origin, destination];
      }
    } catch (error) {
      console.error("❌ Error fetching route:", error);
      // Fallback to straight line on error
      return [origin, destination];
    }
  };

  const getOrderDetails = useCallback(async () => {
    if (isOrderLoaded || !orderId) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("type", "get_data");
    formData.append("table_name", "orders");
    formData.append("id", orderId);

    try {
      const response = await apiCall(formData);
      if (response && response.data && response.data.length > 0) {
        const orderData = response.data[0];
        setOrder(orderData);
        setStatus(orderData?.status);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
      setOrder(null);
    } finally {
      setIsLoading(false);
      setIsOrderLoaded(true); // Mark as loaded to prevent refetching
    }
  }, [orderId, isOrderLoaded]);

  // Get the customer location from the order
  const customerLocation = useMemo(() => {
    // Try order.lat/lng first (customer's service location)
    if (order?.lat && order?.lng) {
      const lat = parseFloat(order.lat);
      const lng = parseFloat(order.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }

    if (order?.user?.lat && order?.user?.lng) {
      const lat = parseFloat(order.user.lat);
      const lng = parseFloat(order.user.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }

    return { latitude: 24.7136, longitude: 46.6753 }; // Riyadh default
  }, [order]);

  useEffect(() => {
    if (orderId && !isOrderLoaded) {
      getOrderDetails();
    }
  }, [orderId, getOrderDetails, isOrderLoaded]);

  useEffect(() => {
    // Animate bottom sheet
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    let isMounted = true;

    const setupLocationTracking = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            setErrorMsg(t("order.permissionDenied"));
            setIsLoading(false);
          }
          return;
        }

        // Get initial location
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          setLocation(currentLocation);
        }

        // Subscribe to location updates - properly store the subscription
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 5, // Update every 5 meters
            timeInterval: 5000, // Or every 5 seconds
          },
          (newLocation) => {
            if (isMounted) {
              setLocation(newLocation);
            }
          }
        );

        // Store the subscription reference
        locationSubscriptionRef.current = subscription;
      } catch (error) {
        console.error("Error getting location:", error);
        if (isMounted) {
          setErrorMsg(t("order.failedToGetLocation"));
          setIsLoading(false);
        }
      }
    };

    setupLocationTracking();

    return () => {
      isMounted = false;
      // Use the ref for cleanup instead of the variable
      if (locationSubscriptionRef.current) {
        locationSubscriptionRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (location && customerLocation) {
      const startPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Fetch actual route through roads from Google Directions API
      const loadRoute = async () => {
        try {
          const routeCoords = await fetchRoute(startPoint, customerLocation);
          setRouteCoordinates(routeCoords);

          // Fit map to show the entire route
          setTimeout(() => {
            if (mapRef.current && routeCoords.length > 0) {
              mapRef.current.fitToCoordinates(routeCoords, {
                edgePadding: { top: 50, right: 50, bottom: 250, left: 50 },
                animated: true,
              });
            }
          }, 500);
        } catch (error) {
          console.error("Error loading route:", error);
          // Fallback to straight line
          setRouteCoordinates([startPoint, customerLocation]);
        } finally {
          setIsLoading(false);
        }
      };

      loadRoute();
    }
  }, [location, customerLocation]);

  if (isLoading && !errorMsg && !order) {
    return (
      <View style={styles.fullScreenLoading}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{t("order.loadingOrderDetails")}</Text>
      </View>
    );
  }
  return (
    <SafeAreaProvider style={styles.container}>
      {/* Map View */}
      {isLoading && !order ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t("order.gettingLocation")}</Text>
        </View>
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Button
            title={t("goBack")}
            onPress={() => router.back()}
            variant="primary"
            paddingvertical={12}
          />
        </View>
      ) : (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location?.coords.latitude || customerLocation.latitude,
            longitude: location?.coords.longitude || customerLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Customer marker */}
          <Marker
            coordinate={customerLocation}
            title={order?.user?.name || t("order.customer")}
            description={order?.user?.address || t("order.customerLocation")}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="person" size={20} color="#fff" />
            </View>
          </Marker>

          {/* Route line */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={3}
              strokeColor={Colors.primary}
            />
          )}
        </MapView>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Header
          backBtn={true}
          title={t("order.trackCustomer")}
          icon={true}
          support={true}
        />
      </View>

      {/* Animated Bottom Sheet */}
      <Animated.View
        style={[
          styles.contentWrapper,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.contentHeader}>
          <Profile />
          <Text style={styles.title}>{t("order.estimatedArrival")}</Text>
        </View>
        <View style={styles.content}>
          {/* Status Tracking */}
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Accepted width={40} height={40} />
              <Text style={styles.statusText}>
                {t("order.orderAcceptedStatus")}
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.statusItem}>
              <OTW width={40} height={40} />
              <Text
                style={[
                  styles.statusText,
                  status === "OnTheWay" ? styles.activeStatusText : {},
                ]}
              >
                {t("order.onTheWay")}
              </Text>
            </View>
            <View
              style={[
                styles.line,
                status === "Arrived" ? styles.line : styles.lineInactive,
              ]}
            />
            <View style={styles.statusItem}>
              <Arrived width={40} height={40} />
              <Text
                style={[
                  styles.statusText,
                  status === "Arrived" ? styles.activeStatusText : {},
                ]}
              >
                {t("order.arrived")}
              </Text>
            </View>
          </View>

          {order && <ProviderCard order={order} />}
        </View>
      </Animated.View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: Colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: Colors.gray100,
    borderRadius: 14,
    marginVertical: 20,
  },
  statusItem: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: Colors.gray300,
    textAlign: "center",
    marginTop: 14,
  },
  statusText2: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: Colors.gray300,
    textAlign: "center",
  },
  activeStatusText: {
    color: Colors.primary,
    fontFamily: FONTS.semiBold,
  },
  line: {
    height: 3,
    flex: 1,
    borderRadius: 99,
    backgroundColor: Colors.primary,
    marginHorizontal: 8,
  },
  lineInactive: {
    height: 3,
    flex: 1,
    borderRadius: 99,
    backgroundColor: Colors.primary100,
    marginHorizontal: 8,
  },
  contentWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    width: "100%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: "hidden",
    maxHeight: "60%", // Prevent overflow
    paddingBottom: 50,
  },
  contentHeader: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  title: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textAlign: "center",
    maxWidth: "80%",
  },
  content: {
    paddingHorizontal: 16,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
  },
  centerButtonContainer: {
    position: "absolute",
    bottom: 300,
    right: 20,
    zIndex: 10,
  },
  centerButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  noOrderContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gray100,
    borderRadius: 8,
  },
  noOrderText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: Colors.gray300,
  },
  arrived: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 22,
    gap: 20,
  },
  arrivedTitle: {
    fontSize: 22,
    color: Colors.secondary,
    fontFamily: FONTS.bold,
    marginTop: 12,
  },
  arrivedText: {
    fontSize: 17,
    fontFamily: FONTS.regular,
    paddingHorizontal: 16,
    marginBottom: 12,
    textAlign: "center",
  },
});
