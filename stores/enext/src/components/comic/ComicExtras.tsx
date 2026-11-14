// Extra per-slide content for the comic-page slider. Slide copy, images and
// accents come from ../v3/heroSlides.ts, so there is one source of truth.
// Plain module (no 'use client') so server components can import it too.

export interface ComicExtra {
    /** Sound effect lettered on the burst */
    sfx: string;
    /** Tiny "indicia" box in the page corner */
    indicia: string;
    /** Three lines for the back of the page (all taken from existing site copy) */
    trust: [string, string, string];
}

export const COMIC_EXTRAS: Record<number, ComicExtra> = {
    1: {
        sfx: 'POW!',
        indicia: 'New every week',
        trust: ['Bagged & boarded', "Near mint or we don't ship it", '30-day returns'],
    },
    2: {
        sfx: 'ZAP!',
        indicia: 'Also on Amazon',
        trust: ['Available instantly', 'No shipping required', 'Starting at $9'],
    },
    3: {
        sfx: 'WOW!',
        indicia: 'Limited stock',
        trust: ['Graded slabs & rare pulls', 'Pokémon, NFL, NBA, baseball', '30-day returns'],
    },
};

export const FALLBACK_EXTRA: ComicExtra = {
    sfx: 'POW!',
    indicia: 'New arrivals',
    trust: ['Bagged & boarded', "Near mint or we don't ship it", '30-day returns'],
};