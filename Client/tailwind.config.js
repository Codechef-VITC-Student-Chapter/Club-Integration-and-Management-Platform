/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "desktop-login": "url('./assets/desktop_login.png')",
        "mobile-login": "url('./assets/mobile_login.png')",
      },
      fontFamily: {
        lato: ["Lato", "sans-serif"],
        mooli: ["Mooli", "sans-serif"],
      },
      colors: {
        primary: "#E9F1FE",
        secondary: "#2E3446",
        "acc-primary": "#4079DA",
        "acc-secondary": "#FFAC33",
        black: "#333333",
        "pitch-black": "#191919",
        "other-green": "#20614C",
        negative: "#DC3545",
        neutral: "#FFC107",
        positive: "#198754",
        skyblue: "#E8F1FE",
      },
    },
  },
  plugins: [],
};
