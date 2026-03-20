import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://genderengine.kianreiling.com',
  integrations: [solidJs(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});
