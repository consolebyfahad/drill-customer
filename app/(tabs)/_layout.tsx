import Plus from "@/assets/svgs/element-plus.svg";
import Home from "@/assets/svgs/home.svg";
import HomeFill from "@/assets/svgs/homeFill.svg";
import OrdersFill from "@/assets/svgs/orderFill.svg";
import Orders from "@/assets/svgs/orders.svg";
import Packages from "@/assets/svgs/packages.svg";
import ProfileFill from "@/assets/svgs/profileFill.svg";
import Profile from "@/assets/svgs/profileIcon.svg";
import { Colors } from "@/constants/Colors";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONTS } from "~/constants/Fonts";
import { ms, s, vs } from "~/utils/responsive";

type CustomTabBarButtonProps = {
  children: React.ReactNode;
};

function CustomTabBarButton({ children }: CustomTabBarButtonProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={() => router.push("/add")}
      style={{
        top: -vs(18),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
        width: s(66),
        height: s(66),
        borderRadius: s(33),
        borderWidth: 4,
        borderColor: "white",
        marginBottom: insets.bottom > 0 ? -insets.bottom / 2 : 0,
      }}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: vs(90) + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopColor: "#eee",
          position: "absolute",
          left: 0,
          right: 0,
          elevation: 0,
          zIndex: 10,
          backgroundColor: "#fff",
          borderTopWidth: 40,
          borderColor: Colors.primary200,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              {focused ? <HomeFill /> : <Home />}
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: Colors.secondary,
                fontSize: ms(11),
                marginBottom: vs(4),
                fontFamily: focused ? FONTS.bold : FONTS.medium,
              }}
            >
              {t("tabs.home")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              <Packages width={s(24)} height={s(24)} />
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: Colors.secondary,
                fontSize: ms(11),
                marginBottom: vs(4),
                fontFamily: focused ? FONTS.bold : FONTS.medium,
              }}
            >
              {t("tabs.packages")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <Plus height={s(26)} width={s(26)} />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              {focused ? <OrdersFill width={s(24)} height={s(24)} /> : <Orders width={s(24)} height={s(24)} />}
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: Colors.secondary,
                fontSize: ms(11),
                marginBottom: vs(4),
                fontFamily: focused ? FONTS.bold : FONTS.medium,
              }}
            >
              {t("tabs.orders")}
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              {focused ? <ProfileFill width={s(24)} height={s(24)} /> : <Profile width={s(24)} height={s(24)} />}
            </View>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: Colors.secondary,
                fontSize: ms(11),
                marginBottom: vs(4),
                fontFamily: focused ? FONTS.bold : FONTS.medium,
              }}
            >
              {t("tabs.account")}
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

const iconContainerStyle = (focused: boolean) => ({
  alignItems: "center" as const,
  borderTopWidth: focused ? 3 : 0,
  borderTopColor: Colors.secondary,
  borderRadius: 2,
  paddingTop: vs(6),
  paddingBottom: vs(6),
});
