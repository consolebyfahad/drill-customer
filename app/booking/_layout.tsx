import { Stack } from "expo-router";
import React from "react";

export default function BookingLayout(): JSX.Element {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
