import Link from 'next/link';
import { T } from '@/components/styles';

export interface AuthFeature {
  icon: string;
  title: string;
  desc: string;
  accent: string;
}

export interface AuthStat {
  value: string;
  label: string;
}

interface AuthLeftPanelProps {
  ghostLabel: string;
  heading: React.ReactNode;
  subtext: string;
  features: AuthFeature[];
  footLabel: string;
  stats: AuthStat[];
}

/**
 * Static marketing/brand panel shown to the left of the login & register
 * forms. Pulled out of Login.jsx / Register.jsx since both pages rendered
 * near-identical markup with only copy differing — this is a server
 * component (no hooks/handlers), so it costs nothing to render on the
 * server and keeps the interactive forms as small client islands.
 */
export function AuthLeftPanel({
  ghostLabel,
  heading,
  subtext,
  features,
  footLabel,
  stats,
}: AuthLeftPanelProps) {
  return (
    <aside className="auth-left">
      <div className="auth-left-stripe" />
      <span className="auth-left-ghost" aria-hidden="true">
        {ghostLabel}
      </span>
      <div className="auth-left-inner">
        <Link href="/" className="auth-left-logo">
          e<span>Fear</span>
        </Link>

        <h2 className="auth-left-heading">{heading}</h2>
        <p className="auth-left-sub">{subtext}</p>

        <div className="auth-features">
          {features.map((f) => (
            <div
              className="auth-feature"
              key={f.title}
              style={{ '--feat-accent': f.accent } as React.CSSProperties}
            >
              <span className="auth-feature-icon">{f.icon}</span>
              <div>
                <p className="auth-feature-title">{f.title}</p>
                <p className="auth-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="auth-left-foot">
          <div className="auth-left-foot-label">{footLabel}</div>
          <div className="auth-stat-row">
            {stats.map((s) => (
              <div key={s.label}>
                <span className="auth-stat-val">{s.value}</span>
                <span className="auth-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export const LOGIN_FEATURES: AuthFeature[] = [
  { icon: '📦', title: 'Free Shipping', desc: 'On all orders over $49. No tricks, no asterisks.', accent: T.red },
  { icon: '🧤', title: 'Mint Condition', desc: 'Every comic arrives bagged, boarded, near-mint.', accent: T.orange },
  { icon: '🔄', title: '30-Day Returns', desc: "Regret your choices? So do we. Send it back.", accent: T.teal },
  { icon: '💬', title: '24/7 Support', desc: "We can't sleep either. Send us a message.", accent: T.red },
];

export const REGISTER_FEATURES: AuthFeature[] = [
  { icon: '⚡', title: 'Early Access', desc: 'New arrivals and restocks, your inbox first.', accent: T.red },
  { icon: '🏷️', title: 'Member Discounts', desc: 'Subscriber-only pricing on select titles.', accent: T.orange },
  { icon: '📋', title: 'Order Tracking', desc: 'Know exactly where your books are at all times.', accent: T.teal },
  { icon: '🎁', title: 'Wishlist', desc: 'Save items, share lists, get notified on drops.', accent: T.red },
];