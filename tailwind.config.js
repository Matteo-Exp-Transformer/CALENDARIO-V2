/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette professionale Blu/Indaco
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },

        // Stato prenotazioni
        status: {
          pending:  '#F59E0B',   // amber
          accepted: '#10B981',   // emerald
          rejected: '#EF4444',   // red
          deleted:  '#6B7280',   // gray
        },

        // Colori eventi calendario
        booking: {
          cena:     '#4F46E5',   // indigo
          aperitivo:'#F59E0B',   // amber
          evento:   '#8B5CF6',   // violet
          laurea:   '#10B981',   // emerald
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft':   '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'medium': '0 4px 25px -5px rgba(0,0,0,0.10), 0 10px 10px -5px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
