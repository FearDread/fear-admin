'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Script from 'next/script';

const slots = {
  square: '4438263094',
  vertical: '2404528095',
  horizontal: '5663714855',
} as const;

type SlotKey = keyof typeof slots;

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface GoogleAdSenseProps {
  client?: string;
  /** One of 'square' | 'vertical' | 'horizontal', or a raw AdSense slot id */
  slot?: SlotKey | string;
  format?: string;
  layout?: string;
  layoutKey?: string;
  responsive?: boolean;
  style?: CSSProperties;
}

export const GoogleAdSense = ({
  client = 'pub-7721831965021640',
  slot = 'horizontal',
  format = 'auto',
  layout,
  layoutKey,
  responsive = true,
  style = { display: 'block' },
}: GoogleAdSenseProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const resolvedSlot = slots[slot as SlotKey] ?? slot;

  const pushAd = () => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error('AdSense push error:', e);
    }
  };

  // If the shared script tag already loaded (e.g. a second ad unit further
  // down the page), push immediately instead of waiting on onLoad again.
  useEffect(() => {
    if (document.querySelector('script[src*="adsbygoogle"]')) {
      pushAd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Script
        id="adsbygoogle-script"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${client}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={pushAd}
      />
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        {...(layout ? { 'data-ad-layout': layout } : {})}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
      />
    </>
  );
};

export default GoogleAdSense;