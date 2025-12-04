// theme.ts
import { MD3LightTheme, MD3Theme, configureFonts } from "react-native-paper";

const fontConfig = {
    displayLarge: {
        fontFamily: "Poppins-SemiBold",
        fontWeight: "600" as const,   // <- string literal
        letterSpacing: 0,
        lineHeight: 64,
        fontSize: 57,
    },
    headlineLarge: {
        fontFamily: "Poppins-SemiBold",
        fontWeight: "600" as const,
        letterSpacing: 0,
        lineHeight: 40,
        fontSize: 32,
    },
    titleMedium: {
        fontFamily: "Poppins-Medium",
        fontWeight: "500" as const,
        letterSpacing: 0.15,
        lineHeight: 24,
        fontSize: 16,
    },
    bodyMedium: {
        fontFamily: "Nunito-Regular",
        fontWeight: "400" as const,
        letterSpacing: 0.25,
        lineHeight: 20,
        fontSize: 14,
    },
    labelLarge: {
        fontFamily: "Nunito-SemiBold",
        fontWeight: "600" as const,
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },
};

export const MyTheme: MD3Theme = {
    ...MD3LightTheme,
    roundness: 8,
    colors: {
        ...MD3LightTheme.colors,
        primary: "#00C853",
        onPrimary: "#FFFFFF",
        primaryContainer: "#B9F6CA",
        onPrimaryContainer: "#003300",
        secondary: "#69f0aeff",
        tertiary: "#A7FFEB",
        background: "#ffffffff",
        surface: "#FFFFFF",
        error: "#B00020",
        onError: "#FFFFFF",
    },
    fonts: configureFonts({ config: fontConfig }),
};
