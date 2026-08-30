// app/product/[id]/loading.tsx
//
// Folder routing note: Next.js auto-detects this filename and renders it
// as a Suspense fallback while page.tsx's server work (getProduct) resolves.
// Nothing needs to import or reference this file — the framework wires it
// up purely from its location next to page.tsx.

export default function ProductLoading() {
  return (
    <div className="pd-page">
      <div className="efear-container">
        <div className="pd-state-screen">
          <div className="pd-spinner" />
          <p className="pd-state-body">Loading product details...</p>
        </div>
      </div>
    </div>
  );
}