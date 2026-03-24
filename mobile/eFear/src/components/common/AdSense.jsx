import { useEffect, useRef } from "react";
const slots = {square:'4438263094',vertical:'2404528095',horizontal:'5663714855'}

export const GoogleAdSense = ({
  client = 'ca-pub-7721831965021640',
  slot = slots[slot] || slots.horizontal,
  format = "auto",
  layout,
  layoutKey,
  responsive = true,
  style = { display: "block" },
}) => {

  const adRef = useRef(null);
  const pushed = useRef(false);

  // 1. Inject the AdSense <script> once per page load
  useEffect(() => {
    if (document.querySelector(`script[src*="adsbygoogle"]`)) return;

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [client]);

  // 2. Push the ad slot once the component mounts
  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { "data-ad-layout": layout } : {})}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      {...(responsive ? { "data-full-width-responsive": "true" } : {})}
    />
  );
}

export default GoogleAdSense;