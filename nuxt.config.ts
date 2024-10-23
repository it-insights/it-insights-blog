export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxtjs/seo',
    '@nuxt/scripts',
    '@nuxthq/studio',
    'nuxt-delay-hydration',
    'nuxt-vitalizer',
  ],
  extends: ['@nuxt/ui-pro'],

  devtools: { enabled: true },
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
        sepia: 'monokai',
      },
      langs: [
        'js',
        'jsx',
        'json',
        'ts',
        'tsx',
        'vue',
        'css',
        'html',
        'vue',
        'bash',
        'md',
        'mdc',
        'yaml',
        'powershell',
        'hcl',
        'xml',
        'docker',
        'dockerfile',
        'csharp',
      ],
    },
    navigation: {
      fields: ['author'],
    },
  },
  icon: {
    collections: ['simple-icons', 'carbon', 'heroicons', 'vscode-icons'],
    clientBundle: {
      scan: true,
    },
    serverBundle: {
      collections: ['simple-icons', 'carbon', 'heroicons', 'vscode-icons'],
    },
  },
  fonts: {
    families: [
      { name: 'Roboto', provider: 'Bunny' },
    ],
    providers: {
      google: false,
    },
  },
  // Analytics
  $production: {
    scripts: {
      registry: {
        plausibleAnalytics: {
          domain: 'itinsights.org',
          extension: [
            'outbound-links',
            'hash',
          ],
        },
      },
    },
  },

  // SEO
  site: {
    name: 'IT Insights Blog',
    url: 'https://itinsights.org',
  },
  ogImage: {
    zeroRuntime: true,
    strictNuxtContentPaths: true,
  },
  sitemap: {
    strictNuxtContentPaths: true,
  },
  app: {
    head: {
      seoMeta: {
        themeColor: [
          { content: '#18181b', media: '(prefers-color-scheme: dark)' },
          { content: 'white', media: '(prefers-color-scheme: light)' },
        ],
      },
    },
  },
  delayHydration: {
    mode: 'init'
  },

  // Nitro
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false,
    },
    preset: 'azure',
  },
  routeRules: {
    '/': { prerender: true },
    '/api/search.json': { prerender: true },
    '/sitemap.xml': { prerender: true },
  },

  compatibilityDate: '2024-07-10',
})