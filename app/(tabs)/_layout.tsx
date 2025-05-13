import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import Home from "@/assets/svgs/home.svg";
import HomeFill from "@/assets/svgs/homeFill.svg";
import Packages from "@/assets/svgs/packages.svg";
import Orders from "@/assets/svgs/orders.svg";
import OrdersFill from "@/assets/svgs/orderFill.svg";
import Profile from "@/assets/svgs/profileIcon.svg";
import ProfileFill from "@/assets/svgs/profileFill.svg";
import Plus from "@/assets/svgs/element-plus.svg";

type CustomTabBarButtonProps = {
  children: React.ReactNode;
};

function CustomTabBarButton({ children }: CustomTabBarButtonProps) {
  const router = useRouter();

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
      }}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: "#fff",
          borderRadius: 15,
          height: 120,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 4,
          borderTopWidth: 40,
          borderColor: Colors.primary200,
        },
        tabBarLabelStyle: {
          color: Colors.secondary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (focused ? <HomeFill /> : <Home />),
        }}
      />
      <Tabs.Screen
        name="packages"
        options={{
          title: "Packages",
          tabBarIcon: ({ focused }) => (focused ? <Packages /> : <Packages />),
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
          tabBarIcon: ({ focused }) => (focused ? <OrdersFill /> : <Orders />),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) =>
            focused ? <ProfileFill /> : <Profile />,
        }}
      />
    </Tabs>
  );
}
