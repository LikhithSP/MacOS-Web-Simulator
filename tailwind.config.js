module.exports = {
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
    },
  },
};
