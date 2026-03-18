module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a8a", // blue-900
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f97316", // orange-500
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#22c55e", // green-500
          foreground: "#ffffff",
        },
        error: {
          DEFAULT: "#ef4444", // red-500
          foreground: "#ffffff",
        },
        meta: {
          blue: "#1877F2",
          dark: "#1c1e21",
          cardbg: {
            light: "#ffffff",
            dark: "#242526"
          },
          border: {
            light: "#dddfe2",
            dark: "#3e4042"
          }
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
