import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
// import ToastManager from "toastify-react-native";
import { ToastProvider } from "../components/ToastProvider";
import i18n from "../utils/config";

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </I18nextProvider>
  );
}
