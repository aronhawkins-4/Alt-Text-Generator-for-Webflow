import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

export default defineManifest({
  name: 'Alt Text Generator for Webflow',
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/wand-magic-sparkles-solid.png',
    32: 'img/wand-magic-sparkles-solid.png',
    48: 'img/wand-magic-sparkles-solid.png',
    128: 'img/wand-magic-sparkles-solid.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/wand-magic-sparkles-solid.png',
  },
  options_page: 'options.html',
  devtools_page: 'devtools.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*.design.webflow.com/*', 'https://*.design.webflow.com/*'],
      js: ['src/contentScript/index.ts'],
    },
  ],
  side_panel: {
    default_path: 'sidepanel.html',
  },
  web_accessible_resources: [
    {
      resources: [
        'img/wand-magic-sparkles-solid.png',
        'img/wand-magic-sparkles-solid.png',
        'img/wand-magic-sparkles-solid.png',
        'img/wand-magic-sparkles-solid.png',
      ],
      matches: [],
    },
  ],
  permissions: ['sidePanel', 'storage'],
})
