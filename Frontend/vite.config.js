import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

console.log(process.env.VITE_BASE_URL);
console.log("alsdj");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_BASE_URL || "https://ailora-2.vercel.app/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

// // https://vite.dev/config/
// export default ({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '')
//   const baseUrl = env.VITE_BASE || 'http://127.0.0.1:5000/'

//   return defineConfig({
//     base: env.VITE_BASE || '/',
//     plugins: [react(), tailwindcss()],
//     server: {
//       proxy: {
//         '/api': {
//           target: baseUrl,
//           changeOrigin: true,
//           secure: false,
//         },
//       },
//     },
//   })
// }
