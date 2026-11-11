/** Single source of truth for canonical URLs and business facts used in SEO. */

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://efear.shop').replace(/\/+$/, '');
export const SITE_NAME = 'eFear';
export const SITE_TAGLINE = 'Comics, E-Books & Collectibles';
export const SITE_DESCRIPTION =
  'Shop comics, manga, e-books, trading cards, and collectibles at eFear. Every comic bagged, boarded, and near mint, with free shipping over $49 and 30-day returns.';

export const DEFAULT_OG_IMAGE = '/assets/images/fear/efear-logo.png';

export const BUSINESS = {
  name: 'eFear',
  legalName: 'FEAR Inc.',
  email: 'ghaptonstall@gmail.com',
  phone: '+1-254-435-0130',
  address: {
    streetAddress: '2003 E. Veterans Memorial Blvd',
    addressLocality: 'Killeen',
    addressRegion: 'TX',
    postalCode: '76541',
    addressCountry: 'US',
  },
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '18:30' },
  sameAs: [] as string[], // add real profile URLs (Facebook, X, Instagram, ...) when you have them
} as const;

export const absoluteUrl = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

/** Strip tags + collapse whitespace, then clip to a meta-description-friendly length. */
export function toDescription(html: string | undefined | null, max = 155): string | undefined {
  if (!html) return undefined;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return undefined;
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}
