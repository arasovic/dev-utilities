import { base } from '$app/paths'

export const prerender = true

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://arasovic.github.io'

const routes = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/json', priority: '0.9', changefreq: 'monthly' },
  { path: '/base64', priority: '0.9', changefreq: 'monthly' },
  { path: '/url', priority: '0.9', changefreq: 'monthly' },
  { path: '/uuid', priority: '0.9', changefreq: 'monthly' },
  { path: '/hash', priority: '0.9', changefreq: 'monthly' },
  { path: '/jwt', priority: '0.9', changefreq: 'monthly' },
  { path: '/color', priority: '0.8', changefreq: 'monthly' },
  { path: '/timestamp', priority: '0.8', changefreq: 'monthly' },
  { path: '/regex', priority: '0.8', changefreq: 'monthly' },
  { path: '/lorem', priority: '0.7', changefreq: 'monthly' }
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]

  const urls = routes.map(route => {
    const loc = `${siteUrl}${base}${route.path}`
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
