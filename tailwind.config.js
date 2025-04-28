/** @type {import('tailwindcss').Config} */
// export default {
//     content: [
//       "./index.html",
//       "./src/**/*.{js,ts,jsx,tsx}",
//     ],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   };
  
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//   ],
// })

/** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: ["./src/**/*.{js,jsx,ts,tsx}"],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   };

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }