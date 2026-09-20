/**
 * Google Ads Console Theme Extension for Tailwind
 * Exposes Google Ads colors and defaults
 */
window.googleAdsTailwindConfig = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        google: {
          bg: "#F8F9FA",
          card: "#FFFFFF",
          outline: "#DADCE0",
          primary: "#1A73E8",
          primaryHover: "#1557B0",
          success: "#1E8E3E",
          error: "#D93025",
          text: "#202124",
          textSecondary: "#5F6368"
        }
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica", "Arial", "sans-serif"]
      }
    }
  }
};
