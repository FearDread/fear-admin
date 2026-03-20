import React, { useEffect } from 'react';

const AdsComponent = ({ adSlot }) => {

  const slots = {square:'4438263094',vertical:'2404528095',horizontal:'5663714855'}
  const ad = slots[adSlot] || slots.square;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense error", e);
    }
  }, []); // Run once on component mount

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }} // Use camelCase for style in React
      data-ad-client="ca-pub-7721831965021640" // Replace with your publisher ID
      data-ad-slot={ad}
      data-ad-format="auto"
      data-full-width-responsive="true"
      data-adtest="on"
    ></ins>
  );
};

export default AdsComponent;