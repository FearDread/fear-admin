interface TrustItem {
  icon: string;
  label: string;
  note: string;
}

const items: TrustItem[] = [
  { icon: '📦', label: 'Free Shipping', note: 'On all orders over $49' },
  { icon: '🛡️', label: 'Bagged & Boarded', note: 'Every comic arrives mint' },
  { icon: '🔄', label: '30-Day Returns', note: 'Regret? No judgment.' },
  { icon: '💬', label: '24/7 Support', note: "We're awake too. Sadly." },
];

export const TrustBar = () => (
  <section className="trust-bar">
    {items.map((item) => (
      <div className="trust-item" key={item.label}>
        <span className="trust-icon">{item.icon}</span>
        <div>
          <strong>{item.label}</strong>
          <span>{item.note}</span>
        </div>
      </div>
    ))}
  </section>
);

export default TrustBar;