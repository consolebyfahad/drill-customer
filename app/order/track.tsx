import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Header from "~/components/header";
import ProviderCard from "~/components/provider_card";
import { Colors } from "~/constants/Colors";
import Accepted from "@/assets/svgs/Button.svg";
import OTW from "@/assets/svgs/RecordButton.svg";
import Arrived from "@/assets/svgs/TrackButton.svg";
import Profile from "@/assets/svgs/profile-circle.svg";

export default function Track() {
  const slideAnim = useRef(new Animated.Value(800)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Order-Track.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Header />

        {/* Animated Bottom Sheet */}
        <Animated.View
          style={[
            styles.contentWrapper,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.contentHeader}>
            <Profile />
            <Text style={styles.title}>
              Service Provider will be arrive in 13:00 Minutes
            </Text>
          </View>
          <View style={styles.content}>
            {/* Status Tracking */}
            <View style={styles.statusContainer}>
              <View style={styles.statusItem}>
                <Accepted width={40} height={40} />
                <Text style={styles.statusText}> Order</Text>
                <Text style={styles.statusText}>Accepted</Text>
              </View>
              <View style={styles.line} />
              <View style={styles.statusItem}>
                <OTW width={40} height={40} />
                <Text style={styles.statusText}>On the Way</Text>
              </View>
              <View style={styles.lineInactive} />
              <View style={styles.statusItem}>
                <Arrived width={40} height={40} />
                <Text style={styles.statusText}>Arrived</Text>
              </View>
            </View>
            <ProviderCard />
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
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
    marginTop: 4,
    color: Colors.gray300,
  },
  line: {
    height: 2,
    flex: 1,
    backgroundColor: Colors.primary,
    marginHorizontal: 5,
  },
  lineInactive: {
    height: 2,
    flex: 1,
    backgroundColor: Colors.primary100,
    marginHorizontal: 5,
  },
  contentWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: "100%",
    elevation: 1,
    shadowColor: Colors.gray100,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    overflow: "hidden",
    shadowRadius: 4,
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
    fontWeight: "500",
    textAlign: "center",
  },
  content: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
});
