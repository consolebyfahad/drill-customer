import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

/** Max content width for tablet/large screens (e.g. iPad) so layout doesn't over-stretch. */
export const MAX_CONTENT_WIDTH = 600;

/** Use for main content container when you want iPad-friendly width. */
export const contentContainerStyle =
  width > MAX_CONTENT_WIDTH
    ? { maxWidth: MAX_CONTENT_WIDTH, width: "100%" as const, alignSelf: "center" as const }
    : undefined;
