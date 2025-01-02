import { defineConfig } from 'wxt';
import { resolve } from 'node:path';

export default defineConfig({
  alias: {
    '@bookup': resolve('src/lib'),
  },
  browser: 'firefox',
  extensionApi: 'webextension-polyfill',
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      name: 'BookUp',
      default_locale: 'en',
      description: '__MSG_extDescription__',
      permissions: [
        "bookmarks",
        "downloads",
        "storage",
        "alarms"
      ],
    };
  },
  modules: ['@wxt-dev/auto-icons'],
  srcDir: 'src',
  autoIcons: {
    enabled: true,
    baseIconPath: "assets/logo.svg",
    grayscaleOnDevelopment: false,
    sizes: [128, 96, 48, 32, 16]
  },
});
