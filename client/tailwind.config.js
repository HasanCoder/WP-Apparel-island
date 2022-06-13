module.exports = {
   purge: ["./src/**/*.html", "./src/**/*.js", "./public/**/*.html"],
   theme: {
      extend: {
         minHeight: {
            16: "4rem",
         },
      },
   },
   variants: {},
   plugins: [require("@tailwindcss/forms")],
};
