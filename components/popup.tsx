import Arrived from "@/assets/svgs/arrived.svg";
import EmptyStarIcon from "@/assets/svgs/emptyStar.svg";
import OrderComplete from "@/assets/svgs/orderComplete.svg";
import StarIcon from "@/assets/svgs/Star.svg";
import Timeup from "@/assets/svgs/timeup.svg";
import Tipup from "@/assets/svgs/tipup.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { apiCall } from "~/utils/api";
import Button from "./button";

type PopupType =
  | "timeup"
  | "tipup"
  | "orderComplete"
  | "review"
  | "accepted"
  | "arrived"
  | "on-way"
  | "completed"
  | "time-up";

type PopupProps = {
  setShowPopup: React.Dispatch<React.SetStateAction<PopupType | null>>;
  type: PopupType;
  orderId: string;
  onCompleted?: () => void;
};

export default function Popup({
  setShowPopup,
  type,
  orderId,
  onCompleted,
}: PopupProps) {
  const { t } = useTranslation();
  const [tipAmount, setTipAmount] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  console.log("type", type);
  const handleNext = () => {
    setShowPopup(null);
  };

  const handleHide = () => {
    setShowPopup(null);
  };

  const handleStartService = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    const latitude = await AsyncStorage.getItem("latitude");
    const longitude = await AsyncStorage.getItem("longitude");
    try {
      if (!orderId) {
        Alert.alert(t("error"), t("popup.orderInfoNotFound"));
        return;
      }

      const formData = new FormData();
      formData.append("type", "add_data");
      formData.append("table_name", "order_history");
      formData.append("user_id", userId);
      formData.append("lat", latitude || "");
      formData.append("lng", longitude || "");
      formData.append("order_id", orderId);
      formData.append("status", "started"); // Use English key for backend

      console.log(formData);
      const response = await apiCall(formData);
      if (response && response.result === true) {
        setShowPopup(null);
        // Alert.alert("Success", "Service has been started");
      } else {
        Alert.alert(t("error"), t("popup.failedToStartService"));
      }
    } catch (error) {
      console.error("Error starting service:", error);
      Alert.alert(t("error"), t("popup.errorStartingService"));
    }
  };

  const handleTipSubmit = async () => {
    try {
      if (!orderId) {
        Alert.alert(t("error"), t("popup.orderInfoNotFound"));
        return;
      }

      const formData = new FormData();
      formData.append("type", "update_data");
      formData.append("table_name", "orders");
      formData.append("id", orderId);
      formData.append("tip_amount", tipAmount || "0");

      const response = await apiCall(formData);

      if (response && response.result === true) {
        // Show review popup after successful tip submission
        setShowPopup("review");
      } else {
        Alert.alert(t("error"), t("popup.failedToSubmitTip"));
      }
    } catch (error) {
      console.error("Error submitting tip:", error);
      Alert.alert(t("error"), t("popup.errorSubmittingTip"));
    }
  };

  const handleAddReview = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId || !orderId) {
        Alert.alert(t("error"), t("popup.userOrOrderNotFound"));
        return;
      }

      const formData = new FormData();
      formData.append("type", "add_data");
      formData.append("table_name", "reviews");
      formData.append("order_id", orderId);
      formData.append("user_id", userId);
      formData.append("rating", rating.toString()); // Rating is a number, safe to send
      formData.append("review", review); // Review text - user input, can be in any language
      formData.append("review_by", "user"); // Use English key for backend

      const response = await apiCall(formData);

      if (response && response.result === true) {
        // Show order complete popup after review submission
        setShowPopup("orderComplete");
      } else {
        Alert.alert(t("error"), t("popup.failedToSubmitReview"));
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert(t("error"), t("popup.errorSubmittingReview"));
    }
  };

  const handleComplete = () => {
    if (onCompleted) {
      onCompleted();
    } else {
      setShowPopup(null);
    }
  };

  const handleMoveHigher = () => {
    // Just hide the popup
    setShowPopup(null);
  };

  const ratingText = [
    t("popup.poor"),
    t("popup.fair"),
    t("popup.good"),
    t("popup.veryGood"),
    t("popup.excellent"),
  ];

  // Render arrived popup content
  if (type === "arrived") {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.dateTime}>21 July 2023, 10:35 AM</Text>
          <View style={styles.arrivedImageContainer}>
            <Arrived />
          </View>
          <Text style={styles.title}>{t("popup.serviceProviderArrived")}</Text>
          <Text style={styles.description}>
            {t("popup.arrivedDescription")}
          </Text>
        </View>
        <View style={styles.footerButtons}>
          <Button
            title={t("popup.notYet")}
            variant="secondary"
            fullWidth={false}
            width="34%"
            onPress={handleHide}
          />
          <Button
            title={t("popup.arrived")}
            variant="primary"
            fullWidth={false}
            width="64%"
            onPress={handleStartService}
          />
        </View>
      </View>
    );
  }

  // Render time-up popup content
  if (type === "time-up") {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Timeup style={styles.image} />
          <Text style={styles.title}>{t("popup.timeUp")}</Text>
          <Text style={styles.description}>{t("popup.timeUpDescription")}</Text>
        </View>
        <View style={styles.footerButtons}>
          <Button
            title={t("popup.complete")}
            variant="secondary"
            fullWidth={false}
            width="34%"
            onPress={handleComplete}
          />
          <Button
            title={t("popup.moveHigher")}
            variant="primary"
            fullWidth={false}
            width="64%"
            onPress={handleMoveHigher}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {type === "timeup" ? (
          <>
            <Timeup style={styles.image} />
            <Text style={styles.title}>{t("popup.timeUp")}</Text>
            <Text style={styles.description}>
              {t("popup.timeUpDescription")}
            </Text>
          </>
        ) : type === "tipup" ? (
          <>
            <Tipup style={styles.image} />
            <Text style={styles.title}>{t("popup.addTip")}</Text>
            <Text style={styles.description}>{t("popup.tipDescription")}</Text>
            <TextInput
              style={styles.input}
              placeholder={t("popup.enterTipAmount")}
              keyboardType="numeric"
              value={tipAmount}
              onChangeText={setTipAmount}
            />
          </>
        ) : type === "orderComplete" ? (
          <>
            <OrderComplete style={styles.image} />
            <Text style={styles.title}>{t("popup.orderCompleted")}</Text>
            <Text style={styles.description}>
              {t("popup.orderCompletedDescription")}
            </Text>
          </>
        ) : type === "review" ? (
          <>
            <Text style={styles.title}>{t("popup.rateExperience")}</Text>
            <Text style={styles.description}>{t("popup.howWasService")}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  {star <= rating ? (
                    <StarIcon height={24} width={24} />
                  ) : (
                    <EmptyStarIcon height={24} width={24} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <>
                <Text style={styles.ratingText}>{ratingText[rating - 1]}</Text>
                <Text style={styles.description}>
                  {t("popup.youGaveStars", {
                    count: rating,
                    stars: rating === 1 ? t("popup.star") : t("popup.stars"),
                  })}
                </Text>
                <TextInput
                  style={styles.textarea}
                  placeholder={t("popup.writeReview")}
                  multiline
                  value={review}
                  onChangeText={setReview}
                />
              </>
            )}
          </>
        ) : null}
      </View>
      <View style={styles.footerButtons}>
        {type === "timeup" ? (
          <>
            <Button
              title={t("popup.complete")}
              variant="secondary"
              fullWidth={false}
              width="34%"
              onPress={handleComplete}
            />
            <Button
              title={t("popup.moveHigher")}
              variant="primary"
              fullWidth={false}
              width="64%"
              onPress={handleMoveHigher}
            />
          </>
        ) : type === "tipup" ? (
          <>
            <Button
              title={t("skip")}
              variant="secondary"
              fullWidth={false}
              width="34%"
              onPress={() => setShowPopup("review")}
            />
            <Button
              title={t("continue")}
              variant="primary"
              fullWidth={false}
              width="64%"
              onPress={handleTipSubmit}
            />
          </>
        ) : type === "orderComplete" ? (
          <Button
            title={t("continue")}
            variant="primary"
            fullWidth={true}
            width="100%"
            onPress={handleComplete}
          />
        ) : type === "review" ? (
          <Button
            title={t("submit")}
            variant="primary"
            fullWidth={true}
            width="100%"
            onPress={handleAddReview}
            disabled={rating === 0}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    shadowRadius: 4,
    zIndex: 99,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  dateTime: {
    color: Colors.secondary300,
    fontSize: 12,
    marginBottom: 10,
  },
  arrivedImageContainer: {
    backgroundColor: Colors.primary300,
    borderRadius: 16,
    padding: 10,
    marginBottom: 15,
    width: "90%",
    alignItems: "center",
  },
  arrivedImage: {
    width: 200,
    height: 160,
  },
  image: {
    marginBottom: 12,
  },
  title: {
    color: Colors.secondary,
    fontSize: 22,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    color: Colors.secondary300,
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    backgroundColor: Colors.primary300,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    marginTop: 10,
    textAlign: "center",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    gap: 8,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: Colors.black,
    textAlign: "center",
    marginTop: 5,
  },
  textarea: {
    width: "100%",
    backgroundColor: Colors.primary300,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    fontFamily: FONTS.regular,
    marginTop: 10,
    textAlignVertical: "top",
    height: 100,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 6,
  },
});
