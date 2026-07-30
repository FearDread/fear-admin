'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  /** Custom breadcrumb items. If omitted, generated from the current pathname. */
  items?: BreadcrumbItem[] | null;
  separator?: string;
  showHome?: boolean;
  homeLabel?: string;
  homePath?: string;
  /** Map URL segments to custom labels */
  labelMap?: Record<string, string>;
}

// Format a URL segment ("my-account") into a readable label ("My Account")
const formatLabel = (segment: string) =>
  segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

function Breadcrumbs({
  items = null,
  showHome = true,
  homeLabel = 'Home',
  homePath = '/',
  labelMap = {},
}: BreadcrumbsProps) {
  const pathname = usePathname();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathnames = pathname.split('/').filter((x) => x);

    return pathnames.map((segment, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = labelMap[segment] || formatLabel(segment);

      return {
        label,
        path,
        isActive: index === pathnames.length - 1,
      };
    });
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Don't show breadcrumb on home page
  if (pathname === '/' && !items) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0 p-0">
        {showHome && (
          <li className="breadcrumb-item">
            <Link href={homePath}>
              <i className="bx bx-home-alt" /> {homeLabel}
            </Link>
          </li>
        )}

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li
              key={item.path || index}
              className={`breadcrumb-item ${isLast || item.isActive ? 'active' : ''}`}
              aria-current={isLast || item.isActive ? 'page' : undefined}
            >
              {isLast || item.isActive ? (
                <>
                  {item.icon && <i className={item.icon} />}
                  {item.label}
                </>
              ) : (
                <Link href={item.path}>
                  {item.icon && <i className={item.icon} />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

// Example usage:

/**
 * 1. Auto-generate from URL:
 * <Breadcrumbs />
 *
 * 2. With custom label mapping:
 * <Breadcrumbs
 *   labelMap={{
 *     'product-details': 'Product Details',
 *     'my-account': 'My Account',
 *     'wishlist': 'My Wishlist'
 *   }}
 * />
 *
 * 3. Custom breadcrumb items:
 * <Breadcrumbs
 *   items={[
 *     { label: 'Products', path: '/products' },
 *     { label: 'Electronics', path: '/products/electronics' },
 *     { label: 'Laptops', path: '/products/electronics/laptops', isActive: true }
 *   ]}
 * />
 *
 * 4. Without home:
 * <Breadcrumbs showHome={false} />
 *
 * 5. Custom home:
 * <Breadcrumbs
 *   homeLabel="Dashboard"
 *   homePath="/dashboard"
 * />
 *
 * 6. With icons:
 * <Breadcrumbs
 *   items={[
 *     { label: 'Products', path: '/products', icon: 'bx bx-shopping-bag' },
 *     { label: 'Wishlist', path: '/wishlist', icon: 'bx bx-heart', isActive: true }
 *   ]}
 * />
 */
