/**
 * app/shop/page.jsx
 *
 * SSR shop listing page.  Replaces pages/shop/Shop2.jsx.
 *
 * Products are fetched server-side so search engines see a full product grid.
 * Filters/sort controls are a client component since they update the URL and
 * re-trigger navigation (no full-page reload, router.push handles it).
 */

import { Suspense } from 'react';
import ShopFilters from './ShopFilters';
import ProductGrid from './ProductGrid';

export const metadata = {
  title: 'Shop',
  description: 'Browse our full collection of products.',
};

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getProducts({ category, sort, page = 1 } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (sort)     params.set('sort', sort);
  params.set('page', page);

  const res = await fetch(
    `${process.env.API_BASE_URL || 'http://localhost:4000'}/fear/api/products?${params}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

async function getCategories() {
  const res = await fetch(
    `${process.env.API_BASE_URL || 'http://localhost:4000'}/fear/api/categories`,
    { next: { revalidate: 3600 } } // categories change rarely
  );
  if (!res.ok) return [];
  return res.json();
}

// ─── Page component (server) ──────────────────────────────────────────────────

export default async function ShopPage({ searchParams }) {
  const { category, sort, page } = searchParams;

  const [{ products = [], total = 0, totalPages = 1 }, categories = []] =
    await Promise.all([
      getProducts({ category, sort, page }),
      getCategories(),
    ]);

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">Shop</h1>
          <p className="text-muted">{total} products</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar filters — client component (updates URL searchParams) */}
        <div className="col-lg-3">
          <ShopFilters
            categories={categories}
            activeCategory={category}
            activeSort={sort}
          />
        </div>

        {/* Product grid — server-rendered with the fetched data */}
        <div className="col-lg-9">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid
              products={products}
              currentPage={Number(page) || 1}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function ProductGridSkeleton() {
  return (
    <div className="row g-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="col-sm-6 col-md-4 col-xl-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="placeholder-glow">
              <div className="placeholder bg-secondary rounded-top" style={{ height: 200, display: 'block' }} />
            </div>
            <div className="card-body">
              <p className="placeholder-glow mb-1">
                <span className="placeholder col-8" />
              </p>
              <p className="placeholder-glow">
                <span className="placeholder col-4" />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}