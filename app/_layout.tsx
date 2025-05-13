import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const loadSplash = async () => {
      router.push("/splash");
    };
    loadSplash();
  }, [router]);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
