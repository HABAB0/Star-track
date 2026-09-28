// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

    ssr: false,
  app: {
      baseURL: '/Star-track/',
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap',
        },
      ],
    },
  },

    nitro: {
        prerender: {
            routes: ['/'],
            crawlLinks: true
        }
    },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
})
