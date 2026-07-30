'use client';

import Link from 'next/link';
import { T } from '@/components/styles';
import type { CartItem } from '@/lib/redux/slices/cartSlice';

interface CartDropdownProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onClose?: () => void;
}

export const CartDropdown = ({ items, onRemoveItem }: CartDropdownProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '320px',
        background: T.dark2,
        border: `1px solid ${T.border}`,
        zIndex: 9999,
        fontFamily: 'var(--font-space-mono), monospace',
        clipPath:
          'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
        boxShadow: '0 8px 32px rgba(0,0,0,.6)',
      }}
    >
      {/* ── Header ── */}
      <Link href="/cart" style={{ textDecoration: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '.6rem 1rem',
            borderBottom: `1px solid ${T.border}`,
            background: 'rgba(255,255,255,.03)',
          }}
        >
          <span
            style={{
              fontSize: '.62rem',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: T.textMid,
            }}
          >
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
          <span
            style={{
              fontSize: '.62rem',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
              color: T.red,
              fontWeight: 700,
            }}
          >
            View Cart →
          </span>
        </div>
      </Link>

      {/* ── Item List ── */}
      <div
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: `${T.border} transparent`,
        }}
      >
        {items.length === 0 ? (
          <p
            style={{
              padding: '1.5rem 1rem',
              textAlign: 'center',
              color: T.textDim,
              fontSize: '.7rem',
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Your cart is empty
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.75rem',
                padding: '.65rem 1rem',
                borderBottom: `1px solid ${T.border}`,
                transition: 'background .15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: '48px',
                  height: '56px',
                  flexShrink: 0,
                  overflow: 'hidden',
                  border: `1px solid ${T.border}`,
                  clipPath:
                    'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image || '/assets/images/ebooks/01.jpg'}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: '0 0 .2rem',
                    fontSize: '.68rem',
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    color: T.textMid,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '.62rem',
                    color: T.textDim,
                    letterSpacing: '.04em',
                  }}
                >
                  {item.quantity} <span style={{ color: T.border }}>×</span>{' '}
                  <span style={{ color: T.red }}>${item.price.toFixed(2)}</span>
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemoveItem(item.id)}
                title="Remove item"
                style={{
                  background: 'none',
                  border: `1px solid ${T.border}`,
                  color: T.textDim,
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '.75rem',
                  flexShrink: 0,
                  transition: 'border-color .15s, color .15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.red;
                  e.currentTarget.style.color = T.red;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color = T.textDim;
                }}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Footer / Total ── */}
      {items.length > 0 && (
        <Link href="/cart" style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '.65rem 1rem',
              borderTop: `1px solid ${T.border}`,
              background: 'rgba(255,255,255,.03)',
            }}
          >
            <span
              style={{
                fontSize: '.62rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                color: T.textMid,
              }}
            >
              Total
            </span>
            <span
              style={{ fontSize: '.8rem', letterSpacing: '.06em', color: T.red, fontWeight: 700 }}
            >
              ${total.toFixed(2)}
            </span>
          </div>
        </Link>
      )}

      {/* ── Checkout CTA ── */}
      <div style={{ padding: '.75rem 1rem' }}>
        <Link
          href="/checkout"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '.6rem 1rem',
            background: T.red,
            color: '#fff',
            fontSize: '.68rem',
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontFamily: 'var(--font-space-mono), monospace',
            fontWeight: 700,
            clipPath:
              'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
            transition: 'opacity .15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '.85';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartDropdown;
