/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: { max: '350px' }, // Custom breakpoint for screens smaller than 330px
      sm: '358px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundImage: {
        'desktop-login': "url('./assets/desktop_login.png')",
        'mobile-login': "url('./assets/mobile_login.png')",
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        mooli: ['Mooli', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
