/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'desktop-login': "url('./assets/desktop_login.png')",
        'mobile-login': "url('./assets/mobile_login.png')",
      },
    },
  },
  plugins: [],
};
