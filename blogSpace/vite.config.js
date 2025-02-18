import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; // Import path module
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // This sets up the alias
    },
  },
});
