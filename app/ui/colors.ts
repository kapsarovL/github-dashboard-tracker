/**
 * Color Utilities — Programmatic access to theme colors
 *
 * Provides type-safe access to color tokens for use in:
 * - JavaScript/TypeScript code
 * - Canvas/SVG operations
 * - Third-party libraries that don't support CSS variables
 * - Dynamic style generation
 *
 * @example
 * // Get current color value
 * const primaryColor = colors.get('primary');
 *
 * @example
 * // Get all neutral colors
 * const neutrals = colors.neutral;
 *
 * @example
 * // Check if dark mode is active
 * const isDark = colors.isDarkMode();
 */

export type ColorToken =
  /* Core tokens */
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  /* Interactive */
  | "primary"
  | "primary-foreground"
  | "primary-hover"
  | "primary-active"
  | "secondary"
  | "secondary-foreground"
  | "secondary-hover"
  | "accent"
  | "accent-foreground"
  | "accent-hover"
  /* Semantic */
  | "success"
  | "success-foreground"
  | "success-bg"
  | "warning"
  | "warning-foreground"
  | "warning-bg"
  | "info"
  | "info-foreground"
  | "info-bg"
  | "destructive"
  | "destructive-foreground"
  | "destructive-hover"
  /* Functional */
  | "border"
  | "input"
  | "input-bg"
  | "ring"
  | "muted"
  | "muted-foreground"
  /* Neutral scale */
  | "neutral-50"
  | "neutral-100"
  | "neutral-200"
  | "neutral-300"
  | "neutral-400"
  | "neutral-500"
  | "neutral-600"
  | "neutral-700"
  | "neutral-800"
  | "neutral-900"
  | "neutral-950";

export interface ColorValues {
  [key: string]: string;
}

/**
 * Get the computed value of a color token
 *
 * @param token - The color token name
 * @returns The computed color value (e.g., "rgb(37, 99, 235)")
 *
 * @example
 * const primaryColor = colors.get('primary');
 * console.log(primaryColor); // "rgb(37, 99, 235)"
 */
export function get(token: ColorToken): string {
  if (typeof window === "undefined") {
    // SSR fallback — return light mode values
    return getStaticValue(token);
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(
    `--${token}`,
  );

  if (!value) {
    console.warn(`Color token "--${token}" not found. Using fallback.`);
    return getStaticValue(token);
  }

  return value.trim();
}

/**
 * Get all neutral scale colors
 *
 * @returns Object with neutral color values
 *
 * @example
 * const neutrals = colors.getNeutral();
 * console.log(neutrals[50]); // "#fafafa" or computed value
 */
export function getNeutral(): Record<number, string> {
  const result: Record<number, string> = {};
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].forEach((step) => {
    result[step] = get(`neutral-${step}` as ColorToken);
  });
  return result;
}

/**
 * Get static fallback values for SSR or when CSS variables are unavailable
 *
 * @internal
 */
function getStaticValue(token: ColorToken): string {
  const staticValues: ColorValues = {
    // Core
    background: "#fafafa",
    foreground: "#09090b",
    card: "#ffffff",
    "card-foreground": "#09090b",
    popover: "#ffffff",
    "popover-foreground": "#09090b",

    // Interactive
    primary: "#2563eb",
    "primary-foreground": "#ffffff",
    "primary-hover": "#1d4ed8",
    "primary-active": "#1e40af",
    secondary: "#f4f4f5",
    "secondary-foreground": "#27272a",
    "secondary-hover": "#e4e4e7",
    accent: "#eff6ff",
    "accent-foreground": "#1e40af",
    "accent-hover": "#dbeafe",

    // Semantic
    success: "#16a34a",
    "success-foreground": "#ffffff",
    "success-bg": "#f0fdf4",
    warning: "#d97706",
    "warning-foreground": "#ffffff",
    "warning-bg": "#fffbeb",
    info: "#0284c7",
    "info-foreground": "#ffffff",
    "info-bg": "#f0f9ff",
    destructive: "#dc2626",
    "destructive-foreground": "#ffffff",
    "destructive-hover": "#b91c1c",

    // Functional
    border: "#e4e4e7",
    input: "#e4e4e7",
    "input-bg": "#ffffff",
    ring: "#2563eb",
    muted: "#f4f4f5",
    "muted-foreground": "#71717a",

    // Neutral scale
    "neutral-50": "#fafafa",
    "neutral-100": "#f4f4f5",
    "neutral-200": "#e4e4e7",
    "neutral-300": "#d4d4d8",
    "neutral-400": "#a1a1aa",
    "neutral-500": "#71717a",
    "neutral-600": "#52525b",
    "neutral-700": "#3f3f46",
    "neutral-800": "#27272a",
    "neutral-900": "#18181b",
    "neutral-950": "#09090b",
  };

  return staticValues[token] || "#000000";
}

/**
 * Check if dark mode is currently active
 *
 * @returns true if dark mode is active
 *
 * @example
 * if (colors.isDarkMode()) {
 *   // Adjust chart colors for dark mode
 * }
 */
export function isDarkMode(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    document.documentElement.classList.contains("dark") ||
    (!document.documentElement.classList.contains("light") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

/**
 * Get contrasting text color for a given background
 *
 * @param backgroundColor - The background color (hex, rgb, or token)
 * @returns "light" or "dark" — the appropriate text color token
 *
 * @example
 * const textColor = colors.getContrastingText('primary');
 * // Returns "primary-foreground"
 */
export function getContrastingText(backgroundColor: string): string {
  // If it's a known token with a foreground variant, return it
  const foregroundToken = `${backgroundColor}-foreground` as ColorToken;
  const tokenValue = getStaticValue(backgroundColor as ColorToken);

  if (tokenValue !== "#000000") {
    // It's a valid token, check if foreground exists
    if (getStaticValue(foregroundToken) !== "#000000") {
      return foregroundToken;
    }
  }

  // Fallback: calculate luminance
  let hex = backgroundColor;

  // Handle CSS variable tokens
  if (backgroundColor.startsWith("--")) {
    hex = get(backgroundColor as ColorToken);
  }

  // Convert to hex if rgb
  if (hex.startsWith("rgb")) {
    const rgb = hex.match(/\d+/g);
    if (rgb) {
      const [r, g, b] = rgb.map(Number);
      hex = rgbToHex(r, g, b);
    }
  }

  // Calculate relative luminance
  const luminance = getLuminance(hex);

  // Return light or dark foreground based on luminance
  return luminance > 0.5 ? "foreground" : "primary-foreground";
}

/**
 * Convert RGB to Hex
 *
 * @internal
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Calculate relative luminance of a color
 *
 * @internal
 * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert Hex to RGB
 *
 * @internal
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Color utilities namespace
 *
 * @example
 * import { colors } from './colors';
 *
 * // Get a color token
 * const primary = colors.get('primary');
 *
 * // Get all neutral colors
 * const neutrals = colors.getNeutral();
 *
 * // Check dark mode
 * const isDark = colors.isDarkMode();
 */
export const colors = {
  get,
  getNeutral,
  isDarkMode,
  getContrastingText,
};

export default colors;
