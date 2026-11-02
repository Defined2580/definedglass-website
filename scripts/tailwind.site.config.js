// Tailwind settings for the static site (was the inline tailwind.config in the page)
module.exports = {
  content: ['./site-template.html', './gallery-config.js'],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: '#00ADEF', light: '#B8E4FF', dark: '#0088CC', 50: '#F0F8FF' },
        brand: { blue: '#00ADEF', dark: '#1a1a2e', charcoal: '#0D0D1A', gray: '#6b7280' }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      }
    }
  }
};
