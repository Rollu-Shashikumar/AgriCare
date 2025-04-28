import tailwindcss from '@tailwindcss/postcss'; // ✅ updated import
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};
