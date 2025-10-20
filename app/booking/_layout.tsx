import { Stack } from "expo-router";

export default function BookingLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="serviceType" options={{ headerShown: false }} />
      <Stack.Screen name="booking2" options={{ headerShown: false }} />
      <Stack.Screen name="confrimBooking" options={{ headerShown: false }} />
      <Stack.Screen name="confrimedBooking" options={{ headerShown: false }} />
      <Stack.Screen name="addCard" options={{ headerShown: false }} />
      <Stack.Screen name="location" options={{ headerShown: false }} />
    </Stack>
  );
}
