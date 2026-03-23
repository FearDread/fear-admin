import React from 'react';
import { useLocation, Link } from 'react-router-dom';

/**
 * Dynamic Breadcrumb Component
 * 
 * @param {Object} props
 * @param {Array} props.items - Custom breadcrumb items [{ label, path, icon }]
 * @param {string} props.separator - Custom separator (default: '/')
 * @param {boolean} props.showHome - Show home icon (default: true)
 * @param {string} props.homeLabel - Custom home label (default: 'Home')
 * @param {string} props.homePath - Custom home path (default: '/')
 * @param {Object} props.labelMap - Map URL segments to custom labels
 */
function Breadcrumbs({ 
  items = null,
  separator = '/',
  showHome = true,
  homeLabel = 'Home',
  homePath = '/',
  labelMap = {}
}) {
  const location = useLocation();

  // Generate breadcrumb items from URL if not provided
  const getBreadcrumbItems = () => {
    if (items) {
      return items;
    }

    const pathnames = location.pathname.split('/').filter(x => x);
    
    const breadcrumbs = pathnames.map((segment, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = labelMap[segment] || formatLabel(segment);
      
      return {
        label,
        path,
        isActive: index === pathnames.length - 1
      };
    });

    return breadcrumbs;
  };

  // Format URL segment to readable label
  const formatLabel = (segment) => {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Don't show breadcrumb on home page
  if (location.pathname === '/' && !items) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0 p-0">
        {showHome && (
          <li className="breadcrumb-item">
            <Link to={homePath}>
              <i className="bx bx-home-alt"></i> {homeLabel}
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
                  {item.icon && <i className={item.icon}></i>}
                  {item.label}
                </>
              ) : (
                <Link to={item.path}>
                  {item.icon && <i className={item.icon}></i>}
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
 * <Breadcrumb />
 * 
 * 2. With custom label mapping:
 * <Breadcrumb 
 *   labelMap={{
 *     'product-details': 'Product Details',
 *     'my-account': 'My Account',
 *     'wishlist': 'My Wishlist'
 *   }}
 * />
 * 
 * 3. Custom breadcrumb items:
 * <Breadcrumb 
 *   items={[
 *     { label: 'Products', path: '/products' },
 *     { label: 'Electronics', path: '/products/electronics' },
 *     { label: 'Laptops', path: '/products/electronics/laptops', isActive: true }
 *   ]}
 * />
 * 
 * 4. Without home:
 * <Breadcrumb showHome={false} />
 * 
 * 5. Custom home:
 * <Breadcrumb 
 *   homeLabel="Dashboard"
 *   homePath="/dashboard"
 * />
 * 
 * 6. With icons:
 * <Breadcrumb 
 *   items={[
 *     { label: 'Products', path: '/products', icon: 'bx bx-shopping-bag' },
 *     { label: 'Wishlist', path: '/wishlist', icon: 'bx bx-heart', isActive: true }
 *   ]}
 * />
 */