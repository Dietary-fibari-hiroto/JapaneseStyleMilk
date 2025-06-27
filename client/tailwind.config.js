/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "header-xxl": ["3.5rem", { lineHeight: "5.5rem" }], // 56px / 88px
        "header-xl": ["2.5rem", { lineHeight: "4rem" }], // 40px / 64px
        "header-l": ["2rem", { lineHeight: "3.25rem" }], // 32px / 52px
        "header-r": ["1.5rem", { lineHeight: "2.5rem" }], // 24px / 40px
        "header-s": ["1.125rem", { lineHeight: "1.75rem" }], // 18px / 28px
        "header-xs": ["1rem", { lineHeight: "1.5rem" }], // 16px / 24px
        "header-xxs": ["0.875rem", { lineHeight: "1.375rem" }], // 14px / 22px
        "body-l": ["1.25rem", { lineHeight: "2rem" }], // 20px / 32px
        "body-r": ["1rem", { lineHeight: "1.5rem" }], // 16px / 24px
        "body-s": ["0.875rem", { lineHeight: "1.375rem" }], // 14px / 22px
        "body-xs": ["0.75rem", { lineHeight: "1.25rem" }], // 12px / 20px
      },
    },
  },
  plugins: [],
};
