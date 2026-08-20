import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/*', '/api/', '/api/*', '/private/'],
      },
    ],
    sitemap: 'https://tvkup.org/sitemap.xml',
    host: 'https://tvkup.org',
  };
}
