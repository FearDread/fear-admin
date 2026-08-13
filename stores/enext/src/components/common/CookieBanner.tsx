'use client';

import { useState } from 'react';

interface CookieCategory {
  id: string;
  label: string;
  desc: string;
  locked?: boolean;
}

const CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    label: 'Essential',
    desc: 'Required for the site to function',
    locked: true,
  },
  { id: 'analytics', label: 'Analytics', desc: 'Help us understand usage' },
  { id: 'marketing', label: 'Marketing', desc: 'Personalised content & ads' },
  { id: 'preferences', label: 'Preferences', desc: 'Remember your settings' },
];

interface CookiePrefs {
  essential: boolean;
  [key: string]: boolean;
}

interface CookieBannerProps {
  onAccept: (prefs: CookiePrefs) => void;
  onReject: () => void;
}

export const CookieBanner = ({ onAccept, onReject }: CookieBannerProps) => {
  const [showCustom, setShowCustom] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const toggle = (id: string) => {
    if (id === 'essential') return;
    setPrefs((p) => ({ ...p, [id]: !p[id] }));
  };

  const acceptAll = () => {
    onAccept({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const saveCustom = () => {
    onAccept(prefs);
  };

  return (
    <div className="cookie-backdrop">
      <div className="cookie-banner">
        <div className="cookie-icon">🍪</div>

        <div className="cookie-content">
          <h2>We value your privacy</h2>
          <p>
            We use cookies to enhance your browsing experience and analyse our traffic. By clicking{' '}
            <strong>&quot;Accept all&quot;</strong> you consent to our use of cookies.{' '}
            <a href="#">Learn more</a>
          </p>

          {showCustom && (
            <div className="cookie-toggles">
              {CATEGORIES.map((cat) => (
                <div className="toggle-item" key={cat.id}>
                  <div
                    className={`toggle ${prefs[cat.id] ? 'on' : ''} ${cat.locked ? 'disabled' : ''}`}
                    onClick={() => toggle(cat.id)}
                    role="switch"
                    aria-checked={prefs[cat.id]}
                    aria-label={cat.label}
                  />
                  <span>{cat.label}</span>
                  <span style={{ color: '#555', fontWeight: 300 }}>— {cat.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cookie-actions">
          <button className="btn-accept" onClick={acceptAll}>
            Accept all
          </button>
          <button className="btn-reject" onClick={onReject}>
            Reject all
          </button>
          {!showCustom ? (
            <button className="btn-custom" onClick={() => setShowCustom(true)}>
              Customise
            </button>
          ) : (
            <button className="btn-custom" onClick={saveCustom}>
              Save preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
