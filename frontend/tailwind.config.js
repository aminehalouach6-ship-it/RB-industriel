/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editorial: {
          bg: '#FAF7F2',
          cream: '#F4EFE7',
          surface: '#FFFFFF',
          pine: '#0D3823',        // Vert forêt profond
          pineHover: '#072416',
          copper: '#C3643B',      // Terre cuite / Cuivre chaud
          copperLight: '#FCF3EE',
          sage: '#EBF4EE',        // Vert menthe doux
          sageText: '#134D2E',
          dark: '#141E18',
          text: '#1C2720',
          muted: '#637067',
          border: '#E8E1D5',
          borderLight: '#F0ECE3',
        },
        tenira: {
          50: '#F5F9F6',
          100: '#E6F2EA',
          500: '#16A34A',
          700: '#0D3823',
          800: '#092919',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 39, 32, 0.05)',
        'float': '0 20px 40px -10px rgba(13, 56, 35, 0.12)',
        'book': '0 25px 50px -12px rgba(13, 56, 35, 0.25), 0 10px 20px -5px rgba(195, 100, 59, 0.15)',
      }
    },
  },
  plugins: [],
}
