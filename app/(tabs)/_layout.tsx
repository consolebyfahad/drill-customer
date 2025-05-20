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
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        top: -20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: "white",
        // Adjust for safe area if needed
        marginBottom: insets.bottom > 0 ? -insets.bottom / 2 : 0,
      }}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 100 + insets.bottom,
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
        tabBarLabelStyle: {
          color: Colors.secondary,
          fontSize: 12,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              {focused ? <HomeFill /> : <Home />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: "Packages",
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              <Packages />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <Plus height={28} width={28} />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              {focused ? <OrdersFill /> : <Orders />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <View style={iconContainerStyle(focused)}>
              {focused ? <ProfileFill /> : <Profile />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const iconContainerStyle = (focused: boolean) => ({
  alignItems: "center",
  borderTopWidth: focused ? 3 : 0,
  borderTopColor: Colors.secondary,
  borderRadius: 2,
  paddingTop: 6,
  paddingBottom: 6, // consistent padding
});
