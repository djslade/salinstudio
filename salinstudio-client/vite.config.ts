import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    ssgOptions: {
      includedRoutes: async () => {
        const endpoint = env.VITE_SERVER_ENDPOINT

        const locales = ['', 'en', 'fi']
        const withLocales = (path: string) =>
          locales.map(l => (l ? `/${l}${path}` : path))

        const staticPaths = [
          '/',
          '/about',
          '/gallery',
          '/commissions',
          '/contact',
          '/store',
        ].flatMap(withLocales)

        let artPaths: string[] = []
        let storePaths: string[] = []

        try {
          const [artRes, storeRes] = await Promise.all([
            fetch(`${endpoint}/art`),
            fetch(`${endpoint}/purchasable/public`),
          ])

          const artData = await artRes.json() as { art: { slug: string }[] }
          artPaths = artData.art.flatMap(({ slug }) =>
            withLocales(`/gallery/${slug}`),
          )

          const storeData = await storeRes.json() as { purchasables: { nanoId: string; isPublic: boolean }[] }
          storePaths = storeData.purchasables
            .filter(p => p.isPublic)
            .flatMap(({ nanoId }) => withLocales(`/store/${nanoId}`))
        } catch (err) {
          console.warn('[ssg] Could not fetch dynamic routes from API:', err)
        }

        return [...staticPaths, ...artPaths, ...storePaths]
      },
    },
  }
})
