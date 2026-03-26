import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductCarousel from "../components/products/ProductCarousel";
import FearHero from "../components/fear/FearHero";
import { 
  selectFeaturedProducts,
  selectProducts,
  fetchProducts,
} from "../features/products/slice";
// ─── CYBERPUNK INTRO ────────────────────────────────────────────────────────
const BOOT_LINES = [
  "Initializing system...",
  "Injecting payload...",
  "Accessing EFEAR database...",
  "WARNING: Unauthorized access detected",
  "Overriding...",
  "ACCESS GRANTED",
];

function CyberpunkIntro({ onFinish }) {
  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= BOOT_LINES.length) {
      const t = setTimeout(() => { setDone(true); onFinish?.(); }, 900);
      return () => clearTimeout(t);
    }
    let i = 0;
    const text = BOOT_LINES[currentLine];
    const iv = setInterval(() => {
      setTyped(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(iv);
        setDisplayed(prev => [...prev, text]);
        setTyped("");
        setCurrentLine(prev => prev + 1);
      }
    }, 22 + Math.random() * 38);
    return () => clearInterval(iv);
  }, [currentLine]);

  if (done) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#000", color: "#ff1a1a",
      fontFamily: "monospace", padding: "40px", zIndex: 9999, overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(to bottom,rgba(255,0,0,.05),rgba(255,0,0,.05) 1px,transparent 1px,transparent 3px)", animation: "glitchMove .2s infinite", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 700 }}>
        {displayed.map((line, i) => (
          <div key={i} style={{ marginBottom: 6, textShadow: "0 0 6px #ff1a1a", opacity: i === displayed.length - 1 ? 1 : 0.7 }}>
            {">"} {line}
          </div>
        ))}
        {currentLine < BOOT_LINES.length && (
          <div style={{ marginBottom: 6, textShadow: "0 0 6px #ff1a1a" }}>
            {">"} {typed}
            <span style={{ display: "inline-block", width: 10, height: 18, background: "#ff1a1a", marginLeft: 5, animation: "blink 1s infinite", verticalAlign: "middle" }} />
          </div>
        )}
      </div>
      <style>{`
        @keyframes blink { 0%,50%,100%{opacity:1} 25%,75%{opacity:0} }
        @keyframes glitchMove { 0%{transform:translate(0)} 20%{transform:translate(-2px,2px)} 40%{transform:translate(2px,-2px)} 60%{transform:translate(-1px,1px)} 80%{transform:translate(1px,-1px)} 100%{transform:translate(0)} }
      `}</style>
    </div>
  );
}

// ─── MOCK PRODUCTS ───────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: "p1", title: "GHOST MECH HOODIE", category: "Hoodies", price: 89.99, salePrice: 64.99, rating: 5, quantity: 8,
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" }] },
  { id: "p2", title: "FEAR TACTICAL TEE", category: "T-Shirts", price: 44.99, rating: 4, quantity: 22,
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" }] },
  { id: "p3", title: "VOID CARGO PANTS", category: "Pants", price: 124.99, salePrice: 99.99, rating: 5, quantity: 5,
    images: [{ url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80" }] },
  { id: "p4", title: "DARK MESH JACKET", category: "Outerwear", price: 199.99, rating: 4, quantity: 12,
    images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" }] },
  { id: "p5", title: "HEX PATTERN SHORTS", category: "Shorts", price: 54.99, salePrice: 39.99, rating: 4, quantity: 0,
    images: [{ url: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80" }] },
  { id: "p6", title: "CIPHER LONG SLEEVE", category: "Tops", price: 59.99, rating: 5, quantity: 18,
    images: [{ url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80" }] },
];

// ─── PRODUCT CARD ────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, wishlist, onToggleWishlist }) {
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = product.salePrice || product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const inWishlist = wishlist.includes(product.id);
  const img = product.images?.[0]?.url || "";

  const handleCart = () => {
    if (!product.quantity) return;
    setAdding(true);
    setTimeout(() => {
      onAddToCart(product);
      setAdding(false);
      setToast("Added to cart!");
      setTimeout(() => setToast(null), 2200);
    }, 600);
  };

  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < product.rating ? "#f4a261" : "#2e2e2e", fontSize: ".8rem" }}>★</span>
  ));

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#111111", border: `1px solid ${hovered ? "#b30e1c" : "#222222"}`,
        position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "border-color .3s, transform .3s", transform: hovered ? "translateY(-6px)" : "translateY(0)",
        clipPath: "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))",
      }}
    >
      {/* Badges */}
      {hasDiscount && (
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 3, background: "#b30e1c", color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: ".6rem", letterSpacing: ".1em", padding: ".2rem .55rem", textTransform: "uppercase" }}>
          -{discountPercent}%
        </div>
      )}
      {!product.quantity && (
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 3, background: "#1a1a1a", border: "1px solid #333", color: "rgba(255,255,255,.5)", fontFamily: "'Space Mono',monospace", fontSize: ".6rem", letterSpacing: ".1em", padding: ".2rem .55rem", textTransform: "uppercase" }}>
          Out of Stock
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => onToggleWishlist(product.id)}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 3, width: 32, height: 32,
          background: "rgba(0,0,0,.6)", border: `1px solid ${inWishlist ? "#b30e1c" : "#333"}`,
          color: inWishlist ? "#b30e1c" : "rgba(255,255,255,.4)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
          transition: "all .2s",
        }}
      >
        {inWishlist ? "♥" : "♡"}
      </button>

      {/* Image */}
      <div style={{ height: 260, overflow: "hidden", background: "#0d0d0d", position: "relative" }}>
        <img src={img} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s", transform: hovered ? "scale(1.07)" : "scale(1)" }} />
        {hovered && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(179,14,28,.15) 0%,transparent 60%)", pointerEvents: "none" }} />
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "1.25rem 1.1rem", flex: 1, display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".6rem", letterSpacing: ".14em", textTransform: "uppercase", color: "#b30e1c" }}>
          {product.category}
        </div>
        <div style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "1rem", textTransform: "uppercase", color: "#fff", letterSpacing: ".03em", lineHeight: 1.1 }}>
          {product.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: ".25rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem" }}>
            {hasDiscount && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".75rem", color: "rgba(255,255,255,.3)", textDecoration: "line-through" }}>${product.price.toFixed(2)}</span>}
            <span style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "1.15rem", color: "#fff" }}>${currentPrice.toFixed(2)}</span>
          </div>
          <div>{stars}</div>
        </div>
        {product.quantity > 0 && product.quantity < 10 && (
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".6rem", letterSpacing: ".1em", color: "#f4a261", textTransform: "uppercase" }}>
            ⚠ Only {product.quantity} left
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ padding: ".75rem 1.1rem 1.1rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <button
          onClick={handleCart}
          disabled={adding || !product.quantity}
          style={{
            padding: ".7rem", background: product.quantity ? (hovered ? "#b30e1c" : "#1a1a1a") : "#111",
            border: `1px solid ${product.quantity ? (hovered ? "#b30e1c" : "#2e2e2e") : "#1a1a1a"}`,
            color: product.quantity ? "#fff" : "rgba(255,255,255,.25)",
            fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".12em",
            textTransform: "uppercase", cursor: product.quantity ? "pointer" : "not-allowed",
            transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
          }}
        >
          {adding ? (
            <><span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin .6s linear infinite" }} /> Adding...</>
          ) : product.quantity ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)",
          background: "#2a9d8f", color: "#fff", fontFamily: "'Space Mono',monospace", fontSize: ".6rem",
          letterSpacing: ".1em", padding: ".4rem .85rem", textTransform: "uppercase", whiteSpace: "nowrap",
          animation: "toastIn .2s ease", zIndex: 10,
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = ["Free Shipping Over $80", "New Drop Every Friday", "Worldwide Delivery", "No Fear — Only Forward", "Limited Editions Always Sell Out", "Gear For The Fearless"];

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div style={{ background: "#b30e1c", overflow: "hidden", padding: ".7rem 0" }}>
      <div style={{ display: "flex", width: "max-content", animation: "marqueeScroll 28s linear infinite" }}>
        {items.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "1rem", textTransform: "uppercase", letterSpacing: ".08em", color: "#fff", whiteSpace: "nowrap", padding: "0 1.5rem" }}>
            {item} <span style={{ opacity: .5, marginLeft: "1.5rem" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── TRUST BAR ───────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: "🚚", title: "Free Shipping", sub: "On orders over $80" },
  { icon: "🔒", title: "Secure Payment", sub: "256-bit SSL encryption" },
  { icon: "↩️", title: "30-Day Returns", sub: "No questions asked" },
  { icon: "🌍", title: "Global Delivery", sub: "Ship to 60+ countries" },
];

function TrustBar() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", background: "#111", borderBottom: "1px solid #222", gap: 0 }}>
      {TRUST_ITEMS.map((item, i) => (
        <div key={i} style={{ flex: "1 1 200px", display: "flex", alignItems: "center", gap: ".75rem", padding: "1.1rem 1.5rem", borderRight: i < TRUST_ITEMS.length - 1 ? "1px solid #222" : "none" }}>
          <span style={{ fontSize: "1.6rem" }}>{item.icon}</span>
          <div>
            <strong style={{ display: "block", fontFamily: "'Space Mono',monospace", fontSize: ".75rem", color: "#fff", letterSpacing: ".08em", textTransform: "uppercase" }}>{item.title}</strong>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".62rem", color: "rgba(255,255,255,.4)", letterSpacing: ".06em" }}>{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── FEATURED PRODUCTS ───────────────────────────────────────────────────────
function FeaturedSection({ cart, wishlist, onAddToCart, onToggleWishlist }) {
  const [activeTab, setActiveTab] = useState("all");
  const tabs = [
    { id: "all", label: "All Drops" },
    { id: "sale", label: "On Sale" },
    { id: "new", label: "New Arrivals" },
    { id: "soldout", label: "Limited" },
  ];

  const filtered = PRODUCTS.filter(p => {
    if (activeTab === "sale") return p.salePrice;
    if (activeTab === "soldout") return p.quantity < 10;
    return true;
  });

  return (
    <section id="featured" style={{ background: "#0d0d0d", padding: "5rem 0", position: "relative", overflow: "hidden", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#b30e1c", display: "block", marginBottom: ".45rem" }}>
              / Featured Drops /
            </span>
            <h2 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", textTransform: "uppercase", color: "#fff", margin: 0, lineHeight: 1, WebkitTextStroke: "1px rgba(255,255,255,.1)" }}>
              THIS WEEK'S <span style={{ color: "#b30e1c", WebkitTextStroke: "1px #b30e1c" }}>FEAR</span>
            </h2>
          </div>
          <a href="#" style={{
            display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".6rem 1.35rem",
            border: "1px solid #222", color: "rgba(255,255,255,.55)", fontFamily: "'Space Mono',monospace",
            fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", textDecoration: "none",
            transition: "border-color .2s, color .2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#b30e1c"; e.currentTarget.style.color = "#b30e1c"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "rgba(255,255,255,.55)"; }}
          >
            View All →
          </a>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: "2.5rem", overflowX: "auto", scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: ".75rem 1.25rem", background: "none", border: "none",
                borderBottom: `2px solid ${activeTab === tab.id ? "#b30e1c" : "transparent"}`,
                color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,.35)",
                fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".1em",
                textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap",
                transition: "color .2s, border-color .2s", marginBottom: -1,
              }}
            >
              {activeTab === tab.id && <span style={{ display: "inline-block", width: 5, height: 5, background: "#b30e1c", borderRadius: "50%", marginRight: ".45rem", verticalAlign: "middle" }} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: "1.5rem" }}>
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              wishlist={wishlist}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Cart count chip */}
        {cart.length > 0 && (
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: ".75rem",
              padding: ".75rem 1.75rem", background: "rgba(179,14,28,.1)", border: "1px solid rgba(179,14,28,.35)",
              fontFamily: "'Space Mono',monospace", fontSize: ".68rem", letterSpacing: ".1em",
              textTransform: "uppercase", color: "#b30e1c",
            }}>
              🛒 {cart.length} item{cart.length !== 1 ? "s" : ""} in cart — Total: ${cart.reduce((s, p) => s + (p.salePrice || p.price), 0).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── WHY US ───────────────────────────────────────────────────────────────────
const WHY_CARDS = [
  { icon: "⚡", title: "Built Different", body: "Every piece is stress-tested, street-approved, and designed to outlast trends by a decade." },
  { icon: "🎯", title: "Precision Cut", body: "We work with a network of underground designers who refuse to compromise on silhouette." },
  { icon: "🔥", title: "Drop Culture", body: "Weekly drops. No padding. No filler. Only gear we'd wear ourselves." },
  { icon: "🧠", title: "Community First", body: "Our buyers shape the next collection. Every review influences the next drop." },
];

function WhySection() {
  return (
    <section id="why" style={{ background: "#111", padding: "6rem 0", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

          {/* Left column */}
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".72rem", letterSpacing: ".2em", textTransform: "uppercase", color: "#b30e1c", marginBottom: ".75rem" }}>
              Why EFEAR
            </div>
            <h2 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "clamp(2rem,4vw,2.75rem)", textTransform: "uppercase", color: "#fff", margin: "0 0 1.5rem", lineHeight: 1.05 }}>
              WE DON'T MAKE<br />FASHION. WE MAKE<br /><span style={{ color: "#b30e1c" }}>ARMOR.</span>
            </h2>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: ".9rem", lineHeight: 1.75, color: "rgba(255,255,255,.6)", marginBottom: "1rem" }}>
              EFEAR was born in a basement in 2018. No investors, no trend reports, no compromises. Just raw materials and a relentless obsession with <em style={{ color: "rgba(255,255,255,.85)" }}>functional design that hits hard</em>.
            </p>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: ".9rem", lineHeight: 1.75, color: "rgba(255,255,255,.6)", marginBottom: "1.5rem" }}>
              Every stitch is intentional. Every cut is violent. Every color is chosen because it means something in the dark.
            </p>
            <a href="#" style={{
              display: "inline-block", fontFamily: "'Space Mono',monospace", fontSize: ".75rem",
              letterSpacing: ".12em", textTransform: "uppercase", color: "#b30e1c",
              textDecoration: "none", borderBottom: "1px solid #b30e1c", paddingBottom: 2,
            }}>
              Our Story →
            </a>
          </div>

          {/* Right column: feature cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {WHY_CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  background: "#161616", border: "1px solid #252525", padding: "1.5rem",
                  transition: "border-color .3s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#b30e1c"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#252525"}
              >
                <span style={{ fontSize: "1.75rem", display: "block", marginBottom: ".75rem" }}>{card.icon}</span>
                <h3 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "1rem", textTransform: "uppercase", color: "#fff", margin: "0 0 .5rem" }}>
                  {card.title}
                </h3>
                <p style={{ fontFamily: "'Space Mono',monospace", fontSize: ".78rem", color: "rgba(255,255,255,.5)", lineHeight: 1.65, margin: 0 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ──────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ position: "relative", background: "#b30e1c", overflow: "hidden", padding: "5rem 0" }}>
      <div style={{ position: "absolute", inset: 0, opacity: .12, backgroundImage: "radial-gradient(circle,rgba(0,0,0,.5) 1px,transparent 1px)", backgroundSize: "18px 18px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", textTransform: "uppercase", color: "#fff", lineHeight: 1.05, margin: "0 0 .75rem" }}>
            JOIN THE<br />FEARLESS.
          </h2>
          <p style={{ fontFamily: "'Space Mono',monospace", color: "rgba(255,255,255,.82)", fontSize: ".95rem", maxWidth: 460, margin: 0 }}>
            Sign up for early access to drops, exclusive discounts, and gear that never hits the mainstream.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
          <div style={{
            display: "flex", height: 50, border: "1px solid rgba(255,255,255,.3)",
            clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
            background: "rgba(0,0,0,.25)", overflow: "hidden",
          }}>
            <input
              placeholder="your@email.com"
              style={{ flex: 1, background: "none", border: "none", color: "#fff", padding: "0 1rem", fontFamily: "'Space Mono',monospace", fontSize: ".75rem", outline: "none", minWidth: 200 }}
            />
            <button style={{
              padding: "0 1.25rem", background: "#fff", border: "none", color: "#b30e1c",
              fontFamily: "'Space Mono',monospace", fontSize: ".72rem", letterSpacing: ".1em",
              textTransform: "uppercase", cursor: "pointer",
              clipPath: "polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)",
            }}>
              Subscribe
            </button>
          </div>
          <a href="#" style={{
            fontFamily: "'Space Mono',monospace", fontSize: ".72rem", letterSpacing: ".1em",
            textTransform: "uppercase", color: "rgba(255,255,255,.82)", textDecoration: "none",
            borderBottom: "1px solid rgba(255,255,255,.4)", paddingBottom: 2,
          }}>
            Explore the full collection →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── OFFER TILES ─────────────────────────────────────────────────────────────
const OFFERS = [
  { accent: "#b30e1c", icon: "💀", eyebrow: "Limited Stock", title: "FEAR\nDROP 08", body: "48-hour window. Once it's gone, it's gone forever.", detail: "Active now", link: "Shop Drop" },
  { accent: "#6120d9", icon: "🌑", eyebrow: "Exclusive", title: "VOID\nEDITION", body: "Matte black everything. For those who prefer the shadows.", detail: "32 units left", link: "Get Access" },
  { accent: "#2a9d8f", icon: "⚡", eyebrow: "Weekend Deal", title: "FLASH\nSALE", body: "30% off select hoodies and outerwear. This weekend only.", detail: "Ends Sunday", link: "Grab It" },
];

function OfferTiles() {
  return (
    <section style={{ background: "#0d0d0d", padding: "5rem 0", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", display: "block", marginBottom: ".5rem" }}>
            / Active Drops /
          </span>
          <h2 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "clamp(2rem,5vw,3rem)", textTransform: "uppercase", color: "#fff", margin: 0 }}>
            DON'T SLEEP ON <span style={{ color: "#b30e1c" }}>THESE</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
          {OFFERS.map((offer, i) => (
            <div
              key={i}
              style={{
                background: "#141414", border: "1px solid #222", padding: "2.25rem",
                clipPath: "polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)",
                position: "relative", overflow: "hidden", transition: "border-color .3s, transform .3s",
                "--o-accent": offer.accent,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = offer.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ position: "absolute", left: 0, top: 0, width: 4, height: "100%", background: offer.accent }} />
              <div style={{ fontSize: "2.25rem", marginBottom: ".75rem" }}>{offer.icon}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: offer.accent, marginBottom: ".5rem" }}>
                {offer.eyebrow}
              </div>
              <h3 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "2rem", textTransform: "uppercase", color: "#fff", margin: "0 0 .75rem", whiteSpace: "pre-line", lineHeight: 1 }}>
                {offer.title}
              </h3>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: ".85rem", lineHeight: 1.7, color: "rgba(255,255,255,.55)", margin: "0 0 1.5rem" }}>
                {offer.body}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #222", paddingTop: "1rem" }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.32)" }}>
                  {offer.detail}
                </span>
                <a href="#" style={{ fontFamily: "'Space Mono',monospace", fontSize: ".7rem", letterSpacing: ".08em", textTransform: "uppercase", color: offer.accent, textDecoration: "none", transition: "letter-spacing .2s" }}>
                  {offer.link} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAR ───────────────────────────────────────────────────────────────
const STATS = [
  { val: "47K+", label: "Community Members" },
  { val: "120+", label: "Active Products" },
  { val: "98%", label: "Satisfaction Rate" },
  { val: "60+", label: "Countries Shipped" },
];

function StatsBar() {
  return (
    <section style={{ background: "#111", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderLeft: "1px solid #222" }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ padding: "2.5rem 2rem", textAlign: "center", borderRight: "1px solid #222" }}>
              <div style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#b30e1c", letterSpacing: ".02em", lineHeight: 1 }}>
                {stat.val}
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginTop: ".5rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER MARQUEE ──────────────────────────────────────────────────────────
function FooterMarquee() {
  const items = ["eFear®", "AW 2025", "Designed in Fear", "Made to Last", "No Compromises", "Be Fearless"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "#b30e1c", overflow: "hidden", padding: ".65rem 0" }}>
      <div style={{ display: "flex", width: "max-content", animation: "marqueeScroll 30s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: ".95rem", textTransform: "uppercase", letterSpacing: ".08em", color: "#fff", whiteSpace: "nowrap", padding: "0 1.5rem" }}>
            {item} <span style={{ opacity: .45, marginLeft: "1.5rem" }}>▸</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── MINI FOOTER ─────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "rgba(0,0,0,.95)", borderTop: "2px solid #b30e1c", padding: "3rem 0 1.5rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: -8, bottom: -12, fontFamily: "'Anton','Impact',sans-serif", fontSize: "clamp(6rem,14vw,12rem)", textTransform: "uppercase", color: "rgba(255,255,255,.02)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
        EFEAR
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1.3fr", gap: "3rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {/* Brand col */}
          <div>
            <a href="#" style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "2.2rem", textTransform: "uppercase", color: "#fff", textDecoration: "none", letterSpacing: ".03em", display: "inline-block", marginBottom: "1rem" }}>
              e<span style={{ color: "#b30e1c" }}>FEAR</span>
            </a>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".68rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.3)", marginBottom: "1.25rem", borderLeft: "2px solid #b30e1c", paddingLeft: ".75rem", display: "block" }}>
              Not For The Comfortable.
            </span>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: ".78rem", color: "rgba(255,255,255,.55)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
              Underground streetwear for those who live on the edge of everything.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: ".8rem", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.9)", margin: "0 0 1.1rem", display: "flex", alignItems: "center", gap: ".65rem" }}>
              Shop <span style={{ flex: 1, height: 1, background: "#222", display: "block" }} />
            </h4>
            {["Hoodies & Sweats", "T-Shirts", "Outerwear", "Pants & Shorts", "Accessories"].map(link => (
              <a key={link} href="#" style={{ display: "flex", justifyContent: "space-between", padding: ".42rem 0", fontFamily: "'Space Mono',monospace", fontSize: ".68rem", letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(255,255,255,.55)", textDecoration: "none", borderBottom: "1px solid #222", transition: "color .2s, padding-left .2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.paddingLeft = ".35rem"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.55)"; e.currentTarget.style.paddingLeft = "0"; }}
              >
                {link} <span style={{ color: "rgba(255,255,255,.25)", fontSize: ".6rem" }}>→</span>
              </a>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: ".8rem", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.9)", margin: "0 0 1.1rem", display: "flex", alignItems: "center", gap: ".65rem" }}>
              Support <span style={{ flex: 1, height: 1, background: "#222", display: "block" }} />
            </h4>
            {["FAQ", "Shipping & Returns", "Size Guide", "Contact Us", "Track Order"].map(link => (
              <a key={link} href="#" style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".42rem 0", fontFamily: "'Space Mono',monospace", fontSize: ".68rem", letterSpacing: ".06em", textTransform: "uppercase", color: "rgba(255,255,255,.55)", textDecoration: "none", borderBottom: "1px solid #222", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.55)"}
              >
                <span style={{ color: "#b30e1c", fontSize: ".6rem" }}>→</span> {link}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: ".8rem", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.9)", margin: "0 0 1.1rem", display: "flex", alignItems: "center", gap: ".65rem" }}>
              Newsletter <span style={{ flex: 1, height: 1, background: "#222", display: "block" }} />
            </h4>
            <div style={{
              display: "flex", height: 44, background: "#141414", border: "1px solid #222",
              clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
              marginBottom: ".85rem",
            }}>
              <input placeholder="Enter your email" style={{ flex: 1, background: "none", border: "none", color: "rgba(255,255,255,.9)", padding: "0 .85rem", fontFamily: "'Space Mono',monospace", fontSize: ".72rem", outline: "none" }} />
              <button style={{
                padding: "0 1rem", background: "#b30e1c", border: "none", color: "#fff",
                fontFamily: "'Space Mono',monospace", fontSize: ".65rem", letterSpacing: ".1em",
                textTransform: "uppercase", cursor: "pointer",
                clipPath: "polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,0 100%)",
              }}>
                Join
              </button>
            </div>
            <p style={{ fontFamily: "'Space Mono',monospace", fontSize: ".6rem", color: "rgba(255,255,255,.3)", lineHeight: 1.65 }}>
              Drop alerts, early access, and members-only codes. No spam. Unsubscribe any time.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ height: 1, background: "#222", marginBottom: "1.5rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: ".62rem", color: "rgba(255,255,255,.3)", margin: 0 }}>
            © 2025 e<span style={{ color: "#b30e1c" }}>FEAR</span>. All rights reserved. Built for the fearless.
          </p>
          <div style={{ display: "flex", gap: ".5rem" }}>
            {["VISA", "MC", "AMEX", "CRYPTO"].map(p => (
              <span key={p} style={{ padding: ".28rem .6rem", background: "#141414", border: "1px solid #222", fontFamily: "'Space Mono',monospace", fontSize: ".58rem", letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.3)" }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Animated gradient border */}
      <div style={{ height: 3, background: "linear-gradient(90deg,#b30e1c,#f4a261,#2a9d8f,#b30e1c)", backgroundSize: "300% 100%", animation: "gradShift 4s linear infinite", marginTop: "1.5rem" }} />
    </footer>
  );
}

// ─── STICKY HEADER ───────────────────────────────────────────────────────────
function Header({ cartCount, wishlistCount }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: scrolled ? "rgba(17,17,17,.98)" : "#111",
      borderBottom: "1px solid #222", backdropFilter: "blur(8px)",
      transition: "box-shadow .35s",
      boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,.7)" : "none",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: ".75rem 1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <a href="#" style={{ fontFamily: "'Anton','Impact',sans-serif", fontSize: "1.6rem", textTransform: "uppercase", color: "#fff", textDecoration: "none", letterSpacing: ".03em", lineHeight: 1, flexShrink: 0 }}>
          e<span style={{ color: "#b30e1c" }}>FEAR</span>
        </a>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 0, flex: 1, overflow: "hidden" }}>
          {["Shop", "Collections", "Drops", "About", "Contact"].map(item => (
            <a key={item} href="#" style={{
              padding: ".85rem 1rem", fontFamily: "'Space Mono',monospace", fontSize: ".65rem",
              letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.55)",
              textDecoration: "none", borderBottom: "2px solid transparent", whiteSpace: "nowrap",
              transition: "color .2s, border-color .2s",
            }}
              onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.borderBottomColor = "#b30e1c"; }}
              onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,.55)"; e.target.style.borderBottomColor = "transparent"; }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: ".35rem", flexShrink: 0 }}>
          {[
            { icon: "♡", label: "Wishlist", count: wishlistCount },
            { icon: "🛒", label: "Cart", count: cartCount },
          ].map(({ icon, label, count }) => (
            <button key={label} title={label} style={{
              position: "relative", width: 42, height: 42, background: "#141414",
              border: "1px solid #222", color: "rgba(255,255,255,.6)", fontSize: "1.1rem",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              transition: "border-color .2s, color .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2e2e2e"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "rgba(255,255,255,.6)"; }}
            >
              {icon}
              {count > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -5, width: 18, height: 18,
                  background: "#b30e1c", color: "#fff", fontFamily: "'Space Mono',monospace",
                  fontSize: ".52rem", display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #111",
                }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Thin red under-line on scroll */}
      {scrolled && <div style={{ height: 2, background: "#b30e1c", width: "80px" }} />}
    </header>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function EFearLanding() {
  const [introDone, setIntroDone] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const handleToggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div style={{ fontFamily: "'Space Mono',monospace", background: "#0d0d0d", color: "rgba(255,255,255,.58)", margin: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        html { scroll-behavior: smooth; }
        @keyframes marqueeScroll { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        @keyframes gradShift { to { background-position:300% center } }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(6px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #222; }
        ::-webkit-scrollbar-thumb:hover { background: #b30e1c; }
        @media (max-width:900px) {
          .why-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width:600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {!introDone && <CyberpunkIntro onFinish={() => setIntroDone(true)} />}

      <Header cartCount={cart.length} wishlistCount={wishlist.length} />
      <FearHero />
      <TrustBar />
      <Marquee />
      <ProductCarousel />
      {/* <FeaturedSection cart={cart} wishlist={wishlist} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />*/}
      <StatsBar />
      <OfferTiles />
      <WhySection />
      <CTABanner />
      <FooterMarquee />
      <Footer />
    </div>
  );
}