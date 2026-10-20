// lib/site.ts — safe to import from both server and client code.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://efear.store').replace(/\/$/, '');
export const SITE_NAME = 'eFear';

export const absoluteUrl = (pathOrUrl: string) =>
    /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;