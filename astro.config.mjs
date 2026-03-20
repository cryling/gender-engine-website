import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: node({
    mode: "standalone"
  })
});