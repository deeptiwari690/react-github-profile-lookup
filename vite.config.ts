import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/react-github-profile-lookup/",
  plugins: [react()],
});
