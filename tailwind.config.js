/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/**/*.{js,ts,jsx,tsx,mdx}",
    "./backend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary, #0A5EB0)",
          dark: "var(--primary-dark, #0B2545)",
          light: "#EBF3FA",
        },
        accent: {
          DEFAULT: "var(--accent, #13A89E)",
          light: "#E6F6F5",
        },
        hospitalBg: "var(--bg, #F5F9FC)",
        surface: "var(--surface, #FFFFFF)",
        hospitalText: "var(--text, #12263A)",
        mutedText: "var(--muted, #5B7083)",
        hospitalBorder: "var(--border, #DCE6EE)",
        success: "var(--success, #2E9E6B)",
        warning: "var(--warning, #F5A524)",
        danger: "var(--danger, #D64545)",
        emergency: "var(--emergency, #C62828)",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Devanagari", "sans-serif"],
        heading: ["Poppins", "Noto Sans Devanagari", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(10, 94, 176, 0.08)",
        floating: "0 10px 30px -5px rgba(11, 37, 69, 0.15)",
        emergency: "0 4px 25px 0 rgba(198, 40, 40, 0.35)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
