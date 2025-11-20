import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "~/constants/Colors";
import { FONTS } from "~/constants/Fonts";
import { OrderType } from "~/types/dataTypes";
import DashedSeparator from "./dashed_seprator";

const OrderDetailsSection = ({ order }: OrderType) => {
  const { t } = useTranslation();
  return (
    <View style={styles.orderDetails}>
      <View style={styles.rowBetween}>
        <Text style={styles.boldText}>{t("package")}</Text>
        <Text style={styles.blueText}>
          {order.package?.name || t("expressService")}
        </Text>
      </View>

      <DashedSeparator />

      <View style={styles.rowBetween}>
        <Text style={styles.boldText}>{t("problemImage")}</Text>
        {order.images ? (
          <Image
            source={{ uri: `${order.image_url}${order.images}` }}
            style={styles.problemImage}
          />
        ) : null}
      </View>

      <Text style={[styles.boldText, { marginBottom: 4 }]}>
        {t("detailAboutProblem")}
      </Text>
      <Text style={styles.grayText}>
        {order.description || t("noDescription")}
      </Text>

      <DashedSeparator />

      {order.created_at && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("orderPlaced")}:</Text>
            <Text style={styles.grayText}>{order.created_at}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.timestamp && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("orderAccepted")}:</Text>
            <Text style={styles.grayText}>{order.timestamp}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.arrived_at_location && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("arrivedAtLocation")}:</Text>
            <Text style={styles.grayText}>{order.arrived_at_location}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.arrival_confirm && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("arrivalConfirm")}:</Text>
            <Text style={styles.grayText}>{order.arrival_confirm}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.work_started && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("workStarted")}:</Text>
            <Text style={styles.grayText}>{order.work_started}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.extra_added && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("extraAdded")}:</Text>
            <Text style={styles.grayText}>{order.extra_added}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.final_images && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("insulationSheet")}:</Text>
            <Text style={styles.grayText}>{order.insulation_sheet}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.item_image && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("itemImage")}:</Text>
            <Image
              source={{ uri: `${order.image_url}${order.item_image}` }}
              style={styles.problemImage}
            />
          </View>
          <DashedSeparator />
        </>
      )}

      {order.bill_image && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("billImage")}:</Text>
            <Image
              source={{ uri: `${order.image_url}${order.bill_image}` }}
              style={styles.problemImage}
            />
          </View>
          <DashedSeparator />
        </>
      )}

      {order.paid_by && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("extraPaidBy")}:</Text>
            <Text style={styles.grayText}>{order.paid_by}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.extra_accepted && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("extraAccepted")}:</Text>
            <Text style={styles.grayText}>{order.extra_accepted}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.job_time_finished && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("jobTimeFinished")}:</Text>
            <Text style={styles.grayText}>{order.job_time_finished}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.bonus_time_started && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("bonusTimeStarted")}:</Text>
            <Text style={styles.grayText}>{order.bonus_time_started}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.bonus_time_ended && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("bonusTimeEnded")}:</Text>
            <Text style={styles.grayText}>{order.bonus_time_ended}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.order_completed && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("orderCompleted")}:</Text>
            <Text style={styles.grayText}>{order.order_completed}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      {order.payment_method && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.grayText}>{t("paymentMethod")}:</Text>
            <Text style={styles.grayText}>{order.payment_method}</Text>
          </View>
          <DashedSeparator />
        </>
      )}

      <View style={styles.rowBetween}>
        <Text style={styles.grayText}>{t("paymentStatus")}:</Text>
        <Text style={styles.grayText}>{order.payment_status || t("pending")}</Text>
      </View>
    </View>
  );
};

export default OrderDetailsSection;

const styles = StyleSheet.create({
  orderDetails: {
    marginTop: 8,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  boldText: { fontFamily: FONTS.semiBold, color: Colors.secondary300 },
  blueText: { fontFamily: FONTS.semiBold, color: Colors.secondary },
  grayText: {
    color: Colors.secondary,
  },
  problemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
});
