module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'brand-green': '#00A86B',
        'brand-yellow': '#F59E0B',
        'brand-orange': '#FB923C',
        'brand-purple': '#1cbb93',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      transitionDuration: {
        DEFAULT: '250ms',
        200: '200ms',
        350: '350ms'
      },
      boxShadow: {
        'card': '0 6px 18px rgba(15,23,42,0.08)',
        'card-md': '0 10px 30px rgba(15,23,42,0.12)'
      },
      borderRadius: {
        'lg-2': '14px'
      },
    },
  },
  plugins: [],
}
