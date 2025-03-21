import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

const { parsed } = loadEnv();

export default defineConfig({
  html: {
    title: 'React Dashboard'
  },
  plugins: [
    pluginReact(),
    pluginSass()
  ],
  server: {
    port: Number(parsed?.PORT || 3000)
  },
  source: {
    define: {
      'process.env': JSON.stringify(parsed)
    }
  }
});
