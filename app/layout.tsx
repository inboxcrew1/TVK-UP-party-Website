'use client';

import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import { LanguageProvider } from '../context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      telephone: '+91-5732-234567',
      contactType: 'Customer Service',
      areaServed: 'IN-UP',
      availableLanguage: ['Hindi', 'English', 'Tamil'],
    },
  };

  return (
    <html lang="hi" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <title>TVK Uttar Pradesh | Tamizhaga Vettri Kazhagam – Uttar Pradesh</title>
        <meta name="description" content="TVK Uttar Pradesh — official digital platform for primary membership registration, district cadre explorer, leadership, ideology, and updates of Tamizhaga Vettri Kazhagam in UP." />
        <meta name="keywords" content="TVK Uttar Pradesh, TVK UP, TVK party Uttar Pradesh, Tamizhaga Vettri Kazhagam Uttar Pradesh, TVK UP membership, TVK membership registration, Thalapathy Vijay UP, TVK UP leadership, TVK UP districts, TVK UP 2027" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#A00000" />
        
        {/* Official TVK Brand Image Favicon & Icons */}
        <link rel="icon" type="image/jpeg" href="/media/tvk_brand_icon.jpg" />
        <link rel="shortcut icon" type="image/jpeg" href="/media/tvk_brand_icon.jpg" />
        <link rel="apple-touch-icon" href="/media/tvk_brand_icon.jpg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tvkup.org" />
        <meta property="og:title" content="TVK Uttar Pradesh | Tamizhaga Vettri Kazhagam" />
        <meta property="og:description" content="Official digital membership portal & district cadre network for TVK in Uttar Pradesh." />
        <meta property="og:image" content="https://tvkup.org/media/hero_slider_tvk_up.jpg" />
        <meta property="og:site_name" content="TVK Uttar Pradesh" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TVK Uttar Pradesh | Tamizhaga Vettri Kazhagam" />
        <meta name="twitter:description" content="Official digital membership portal & district cadre network for TVK in Uttar Pradesh." />
        <meta name="twitter:image" content="https://tvkup.org/media/hero_slider_tvk_up.jpg" />

        {/* Structured Data Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="bg-[#040105] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
