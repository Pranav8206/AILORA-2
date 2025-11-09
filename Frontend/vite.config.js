import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
