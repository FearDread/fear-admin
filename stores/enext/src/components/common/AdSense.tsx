// src/components/common/AdSense.tsx
'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

const PUBLISHER_ID = 'ca-pub-7721831965021640';

const SLOTS = {
    square: '4438263094',
    vertical: '2404528095',
    horizontal: '5663714855',
} as const;

type SlotKey = keyof typeof SLOTS;

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

interface GoogleAdSenseProps {
    /** 'square' | 'vertical' | 'horizontal', or a raw AdSense slot id */
    slot?: SlotKey | string;
    format?: string;
    layout?: string;
    layoutKey?: string;
    responsive?: boolean;
    /** Reserve vertical space to prevent layout shift (CLS) */
    minHeight?: number;
    style?: CSSProperties;
}

export const GoogleAdSense = ({
    slot = 'horizontal',
    format = 'auto',
    layout,
    layoutKey,
    responsive = true,
    minHeight = 100,
    style,
}: GoogleAdSenseProps) => {
    const pushed = useRef(false);
    const resolvedSlot = SLOTS[slot as SlotKey] ?? slot;

    useEffect(() => {
        // Guard against React Strict Mode's double-invoked effects in dev,
        // which would otherwise push the same unit twice and throw.
        if (pushed.current) return;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch (e) {
            console.error('AdSense push error:', e);
        }
    }, []);

    return (
        <div style={{ minHeight, width: '100%', overflow: 'hidden' }}>
    <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={ PUBLISHER_ID }
        data-ad-slot={ resolvedSlot }
        data-ad-format={ format }
            {...(layout ? { 'data-ad-layout': layout } : {}) }
            {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {}) }
            {...(responsive ? { 'data-full-width-responsive': 'true' } : {}) }
      />
    </div>
  );
};

export default GoogleAdSense;