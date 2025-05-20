import Button from "@/components/button";
import Header from "@/components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Popup from "~/components/popup";
import { useToast } from "~/components/ToastProvider";
import { Colors } from "~/constants/Colors";
import { OrderType } from "~/types/dataTypes";
import { apiCall } from "~/utils/api";
import {
  getFCMToken,
  requestFCMPermission,
  setupNotificationListeners,
} from "~/utils/notification";
import ChatScreen from "./chat_screen";
import OrderDetails from "./order_details";

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

// Define notification data type
interface NotificationData {
  order_id?: string;
  status?: string;
  message?: string;
}

const OrderPlace: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("Details");
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [detailsScreen, setDetailsScreen] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    if (popupType) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [popupType]);
  useEffect(() => {
    const initFCM = async () => {
      try {
        await requestFCMPermission();
        const token = await getFCMToken();
        console.log("📲 User FCM Token:", token);
      } catch (error) {
        console.error("Error initializing FCM:", error);
      }
    };

    const handleNotificationPress = async (data: NotificationData) => {
      console.log("🚨 Customer notification received:", data);

      if (data?.order_id) {
        // If the notification is about the current order
        if (orderId && data.order_id === orderId) {
          // Refresh order details
          getOrderDetails(data.order_id);

          // Display toast for status change
          if (data.status) {
            showStatusNotification(data.status, data.message);
          }
        }
      }
    };

    initFCM();
    const unsubscribe = setupNotificationListeners(handleNotificationPress);
    return () => unsubscribe(); // Clean up listeners
  }, [orderId]);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        try {
          const storedOrderId = await AsyncStorage.getItem("order_id");
          const userId = await AsyncStorage.getItem("user_id");
          console.log("order_id", storedOrderId);
          setOrderId(storedOrderId);
          setUserId(userId);

          if (storedOrderId) {
            getOrderDetails(storedOrderId);
          }
        } catch (error) {
          console.error("Initialization error:", error);
          showToast("Failed to initialize order details", "error");
        }
      };
      init();
    }, [])
  );

  const getOrderDetails = async (id: string) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("type", "get_data");
    formData.append("table_name", "orders");
    formData.append("id", id);

    try {
      const response = await apiCall(formData);
      if (response && response.data && response.data.length > 0) {
        const orderData = response.data[0];

        if (order && order.status !== orderData.status) {
          handleOrderStatusChange(order.status, orderData.status);
        }

        setOrder(orderData);
      } else {
        showToast("No order details found", "error");
        setOrder(null);
      }
    } catch (error) {
      console.error("Failed to fetch order details", error);
      showToast("Failed to fetch order details", "error");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle order status changes
  const handleOrderStatusChange = (oldStatus: string, newStatus: string) => {
    console.log(`Order status changed from ${oldStatus} to ${newStatus}`);

    // Show appropriate notification based on the new status
    showStatusNotification(newStatus);
  };

  // Show notification for status changes
  const showStatusNotification = (status: string, customMessage?: string) => {
    let message = customMessage;
    let toastType = "info";

    if (!message) {
      // Default messages based on status
      switch (status.toLowerCase()) {
        case "accepted":
          message = "Your order has been accepted by a service provider!";
          toastType = "success";
          break;
        case "on_the_way":
          message = "Your service provider is on the way!";
          toastType = "info";
          break;
        case "arrived":
          message = "Service provider has arrived at your location.";
          toastType = "success";
          // Show arrived popup instead of toast for arrived status
          setPopupType("arrived");
          return; // Don't show the toast for arrived status
        case "started":
          message = "Your service has started.";
          toastType = "info";
          break;
        case "in_progress":
          message = "Your service is now in progress.";
          toastType = "info";
          break;
        case "completed":
          message =
            "Your service has been completed. Please review the service.";
          toastType = "success";
          setPopupType("orderComplete");
          return; // Don't show the toast for completed status
        case "cancelled":
          message = "Your order has been cancelled.";
          toastType = "warning";
          break;
        case "time_up":
          // Show time-up popup
          setPopupType("time-up");
          return; // Don't show the toast for time-up status
        default:
          message = `Your order status has been updated to: ${status}`;
          toastType = "info";
      }
    }

    // Show toast notification
    showToast(message, toastType as any);
  };

  const handlePay = async () => {
    if (orderId) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("type", "update_data");
      formData.append("table_name", "orders");
      formData.append("id", orderId);
      formData.append("status", "completed");

      try {
        const response = await apiCall(formData);
        if (response && response.result === true) {
          // Show tip popup on successful completion
          setPopupType("tipup");
        } else {
          showToast("Failed to complete order", "error");
        }
      } catch (error) {
        console.error("Error completing order:", error);
        showToast("An error occurred while completing the order", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    // For confirmation dialogs, we still need to use some form of modal
    // Here, we'll create a simple confirmation dialog using a toast + timeout
    showToast("Tap again to confirm cancellation", "warning");

    // Set a flag in state to track confirmation intent
    const confirmTimeout = setTimeout(() => {
      // Toast to indicate cancellation intent expired
      showToast("Cancellation request expired", "info");
    }, 3000);

    // Create a second function to handle the actual cancellation
    const confirmCancel = async () => {
      clearTimeout(confirmTimeout);

      if (orderId) {
        const formData = new FormData();
        formData.append("type", "update_data");
        formData.append("table_name", "orders");
        formData.append("id", orderId);
        formData.append("status", "cancelled");

        try {
          const response = await apiCall(formData);
          if (response && response.result === true) {
            showToast("Order has been cancelled", "success");
            router.replace("/(tabs)");
          } else {
            showToast("Failed to cancel order", "error");
          }
        } catch (error) {
          console.error("Error cancelling order:", error);
          showToast("An error occurred while cancelling the order", "error");
        }
      }
    };

    // In a real implementation, you might want to use a modal or create a more robust confirmation flow
    // This is a simplified example using toasts
  };

  const handleActiveChat = () => {
    setActiveTab("Chat");
    setDetailsScreen(false);
  };

  const handleDetailsScreen = () => {
    setActiveTab("Details");
    setDetailsScreen(true);
  };

  const handleOrderCompleted = async () => {
    if (orderId) {
      const formData = new FormData();
      formData.append("type", "update_data");
      formData.append("table_name", "orders");
      formData.append("id", orderId);
      formData.append("status", "completed");

      try {
        const response = await apiCall(formData);
        if (response && response.result === true) {
          setPopupType(null); // Hide popup
          router.replace("/(tabs)"); // Navigate to tabs screen
        } else {
          showToast("Failed to complete order", "error");
        }
      } catch (error) {
        console.error("Error completing order:", error);
        showToast("An error occurred while completing the order", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Header
            backBtn={true}
            title="Loading..."
            icon={true}
            support={true}
            backAddress={"/(tabs)"}
          />
          <View style={styles.loadingContainer}>
            <Text>Loading order details...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Header
            backBtn={true}
            title="Order Details"
            icon={true}
            support={true}
            backAddress={"/(tabs)"}
          />
          <View style={styles.loadingContainer}>
            <Text>No order details available</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header
          backBtn={true}
          title={`Request #${order.order_no}`}
          icon={true}
          support={true}
          backAddress={"/(tabs)"}
        />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={
              activeTab === "Details" ? styles.activeTab : styles.inactiveTab
            }
            onPress={handleDetailsScreen}
          >
            <Text
              style={
                activeTab === "Details"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Detail
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={activeTab === "Chat" ? styles.activeTab : styles.inactiveTab}
            onPress={handleActiveChat}
          >
            <Text
              style={
                activeTab === "Chat"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Chat
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "Details" ? (
          <OrderDetails order={order} />
        ) : (
          <ChatScreen />
        )}
      </View>

      {detailsScreen && (
        <View style={styles.footerButtons}>
          {order.status !== "started" ? (
            <>
              <Button
                title="Cancel"
                variant="secondary"
                fullWidth={false}
                width="32%"
                onPress={handleCancel}
              />
              <Button
                title="Pay Now"
                variant="primary"
                fullWidth={false}
                width="65%"
                onPress={handlePay}
              />
            </>
          ) : (
            <Button
              title="Pay Now"
              variant="primary"
              fullWidth={true}
              width="100%"
              onPress={handlePay}
            />
          )}
        </View>
      )}

      {/* Popup with Background Overlay */}
      {showPopup && popupType && (
        <Modal transparent visible={showPopup} animationType="slide">
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.overlayBackground}
              onPress={() => popupType !== "arrived" && setPopupType(null)}
            />
            <View style={styles.popupContainer}>
              <Popup
                type={popupType}
                setShowPopup={setPopupType}
                orderId={orderId || ""}
                onCompleted={handleOrderCompleted}
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flex: 1, padding: 16 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.primary300,
    borderRadius: 25,
  },
  activeTab: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 25,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  activeTabText: { color: Colors.white, fontSize: 16, fontWeight: "500" },
  inactiveTabText: {
    color: Colors.secondary300,
    fontSize: 16,
    fontWeight: "500",
  },
  inactiveTab: {
    fontSize: 16,
    padding: 16,
    borderRadius: 25,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContainer: {
    backgroundColor: Colors.white,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderPlace;
