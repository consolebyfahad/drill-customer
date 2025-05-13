import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";

export default function RootLayout(): JSX.Element | null {
  const router = useRouter();

  useEffect(() => {
    const loadSplash = async () => {
      router.push("/splash");
    };
    loadSplash();
  }, []);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
