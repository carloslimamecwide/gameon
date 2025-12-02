export const Colors = {
  // Football field inspired colors with clean light theme
  primary: "#2E7D32", // Forest green (football field)
  primaryLight: "#A5D6A7", // Light green for subtle backgrounds
  secondary: "#1976D2", // Deep blue (team color)
  accent: "#FF6F00", // Orange (referee/warning)

  // Neutral colors - clean and modern
  background: "#F5F7FA", // Soft blue-gray background
  surface: "#FFFFFF", // Pure white for cards/surfaces
  card: "#FFFFFF",

  // Text colors
  text: "#1A202C", // Dark slate for primary text
  textSecondary: "#718096", // Medium gray for secondary text
  textOnPrimary: "#FFFFFF", // White text on primary color

  // Status colors
  success: "#4CAF50", // Green for success states
  warning: "#FF9800", // Orange for warnings
  error: "#F44336", // Red for errors
  info: "#2196F3", // Blue for info

  // UI elements
  border: "#E2E8F0", // Light gray for borders
  divider: "#F1F5F9", // Very light gray for dividers
  tabInactive: "#9E9E9E", // Gray for inactive tabs
};

export const Spacing = {
  xs: 3,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 36,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "bold" as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold" as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 18,
  },
};
