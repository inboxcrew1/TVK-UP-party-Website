import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import type { Metadata } from 'next';

const inter = { variable: 'font-sans' };
const outfit = { variable: 'font-display' };

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'TVK Uttar Pradesh | Tamizhaga Vettri Kazhagam – Uttar Pradesh',
  description: 'TVK Uttar Pradesh — official digital platform for primary membership registration, district cadre explorer, leadership, ideology, and updates of Tamizhaga Vettri Kazhagam in UP.',
  keywords: 'TVK Uttar Pradesh, TVK UP, TVK party Uttar Pradesh, Tamizhaga Vettri Kazhagam Uttar Pradesh, TVK UP membership, TVK membership registration, Thalapathy Vijay UP, TVK UP leadership, TVK UP districts, TVK UP 2027',
  openGraph: {
    type: 'website',
    url: 'https://tvkup.org',
    title: 'TVK Uttar Pradesh | Tamizhaga Vettri Kazhagam',
    description: 'Official digital membership portal & district cadre network for TVK in Uttar Pradesh.',
    images: [{ url: 'https://tvkup.org/media/hero_slider_tvk_up.jpg' }],
    siteName: 'TVK Uttar Pradesh',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TVK Uttar Pradesh | Tamizhaga Vettri Kazhagam',
    description: 'Official digital membership portal & district cadre network for TVK in Uttar Pradesh.',
    images: ['https://tvkup.org/media/hero_slider_tvk_up.jpg'],
  },
};

export const viewport = {
  themeColor: '#A00000',
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tamizhaga Vettri Kazhagam Uttar Pradesh',
  alternateName: 'TVK Uttar Pradesh',
  url: 'https://tvkup.org',
  logo: 'https://tvkup.org/media/tvk_brand_icon.jpg',
  image: 'https://tvkup.org/media/hero_slider_tvk_up.jpg',
  description:
    'Official digital platform for membership, leadership, districts, ideology, and organizational activities of Tamizhaga Vettri Kazhagam in Uttar Pradesh.',
  foundingDate: '2024',
  founder: {
    '@type': 'Person',
    name: 'C. Joseph Vijay (Thalapathy Vijay)',
    jobTitle: 'President & Founder',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bulandshahr',
    addressRegion: 'Uttar Pradesh',
    postalCode: '203001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9762154127',
    contactType: 'Customer Service',
    areaServed: 'IN-UP',
    availableLanguage: ['Hindi', 'English', 'Tamil'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Official TVK Brand Image Favicon & Icons */}
        <link rel="icon" type="image/jpeg" href="/media/tvk_brand_icon.jpg" />
        <link rel="shortcut icon" type="image/jpeg" href="/media/tvk_brand_icon.jpg" />
        <link rel="apple-touch-icon" href="/media/tvk_brand_icon.jpg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Structured Data Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#040105] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
