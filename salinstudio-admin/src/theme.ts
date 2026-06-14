import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

// Primary: warm gold derived from the client's #b4936f accent
const gold = {
  50: "#fdf8f3",
  100: "#f5e8d8",
  200: "#e8d0b5",
  300: "#d9b88e",
  400: "#c9a07a",
  500: "#b4936f",
  600: "#9a7a59",
  700: "#7d6147",
  800: "#614a35",
  900: "#4a3828",
  950: "#2e2218",
};

// Surface: warm neutrals whose dark end matches the client's #261f19 / #1e1914
const warm = {
  50: "#faf7f4",
  100: "#f0e8df",
  200: "#e0d0c0",
  300: "#c9b49a",
  400: "#b09578",
  500: "#96795c",
  600: "#7a6048",
  700: "#5e4836",
  800: "#3f3026",
  900: "#261f19",
  950: "#1e1914",
};

export const SalinPreset = definePreset(Aura, {
  primitive: { gold, warm },
  semantic: {
    primary: {
      50: "{gold.50}",
      100: "{gold.100}",
      200: "{gold.200}",
      300: "{gold.300}",
      400: "{gold.400}",
      500: "{gold.500}",
      600: "{gold.600}",
      700: "{gold.700}",
      800: "{gold.800}",
      900: "{gold.900}",
      950: "{gold.950}",
    },
    colorScheme: {
      light: {
        primary: {
          color: "{primary.500}",
          inverseColor: "#ffffff",
          hoverColor: "{primary.600}",
          activeColor: "{primary.700}",
        },
        surface: {
          0: "#ffffff",
          50: "{warm.50}",
          100: "{warm.100}",
          200: "{warm.200}",
          300: "{warm.300}",
          400: "{warm.400}",
          500: "{warm.500}",
          600: "{warm.600}",
          700: "{warm.700}",
          800: "{warm.800}",
          900: "{warm.900}",
          950: "{warm.950}",
        },
      },
      dark: {
        primary: {
          color: "{primary.400}",
          inverseColor: "{primary.950}",
          hoverColor: "{primary.300}",
          activeColor: "{primary.200}",
        },
        surface: {
          0: "#ffffff",
          50: "{warm.50}",
          100: "{warm.100}",
          200: "{warm.200}",
          300: "{warm.300}",
          400: "{warm.400}",
          500: "{warm.500}",
          600: "{warm.600}",
          700: "{warm.700}",
          800: "{warm.800}",
          900: "{warm.900}",
          950: "{warm.950}",
        },
      },
    },
  },
});
