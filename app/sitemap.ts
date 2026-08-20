import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tvkup.org';
  const currentDate = new Date().toISOString();

  const publicRoutes = [
    '',
    '/sadasyata',
    '/about',
    '/leadership',
    '/ideology',
    '/districts',
    '/wings',
    '/elections',
    '/gallery',
    '/history',
  ];

  const upDistricts = [
    'bulandshahr',
    'lucknow',
    'kanpur-nagar',
    'varanasi',
    'prayagraj',
    'agra',
    'gorakhpur',
    'meerut',
    'gautam-buddha-nagar',
    'ghaziabad',
    'bareilly',
    'aligarh',
    'moradabad',
    'ayodhya',
    'jhansi',
  ];

  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route === '/sadasyata' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/sadasyata' ? 0.9 : 0.8,
  }));

  const districtEntries: MetadataRoute.Sitemap = upDistricts.map((d) => ({
    url: `${baseUrl}/districts/${d}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticEntries, ...districtEntries];
}
