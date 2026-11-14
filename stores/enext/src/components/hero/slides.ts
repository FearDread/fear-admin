export interface HeroSlide {
  id: number;
  label: string; // short tab label
  heading: string;
  sub: string;
  body: string;
  cta: string;
  ctaLink: string;
  accent: string;
  image: string;
  alt: string; // descriptive alt text — this is what Google Images indexes
}

// Same content and images as the v2 ComicHero. No 'use client' here on
// purpose: plain data, importable from server components (page.tsx JSON-LD etc).
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    label: 'Comics',
    heading: 'Comics',
    sub: 'Marvel, DC, Dark Horse and indie',
    body: 'Thousands of titles. Every one bagged, boarded, and mint. Your pull list just got dangerous.',
    cta: 'Browse comics',
    ctaLink: '/shop',
    accent: '#c40717',
    image: '/assets/images/comics/home01.png',
    alt: 'Bagged and boarded comic books from Marvel, DC and independent publishers',
  },
  {
    id: 2,
    label: 'E-Books',
    heading: 'E-Books',
    sub: 'Cookbooks, manifestos and biographies',
    body: 'Words that hit harder than a Mjolnir swing. Available instantly, no shipping required.',
    cta: 'Explore e-books',
    ctaLink: '/shop',
    accent: '#6f11e1',
    image: '/assets/images/ebooks/02.jpg',
    alt: 'eFear e-book collection cover art',
  },
  {
    id: 3,
    label: 'Collectibles',
    heading: 'Collectibles',
    sub: 'Pokémon, NFL, NBA and baseball cards',
    body: 'Rare cards. Graded slabs. Pack pulls that will either make your day or haunt your dreams.',
    cta: 'Shop collectibles',
    ctaLink: '/shop',
    accent: '#1081a7',
    image: '/assets/images/comics/_trading_cards_1.jpg',
    alt: 'Graded trading cards and collectible slabs',
  },
];
