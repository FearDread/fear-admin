import { useState } from 'react';
import { ChevronRight, Home } from 'lucide-react';

// Dynamic Breadcrumb Component
export const BreadCrumbs = ({ 
  breadcrumbs = [], 
  onBreadcrumbClick, 
  showHomeIcon = true,
  separator = 'chevron',
  className = '',
  homeLabel = 'Home'
}) => {

  const defaultCrumbs = [{ id: 'home', label: 'Home', path: '/' }];
  const renderSeparator = () => {
    if (separator === 'chevron') {
      return <ChevronRight size={16} className="text-gray-400 mx-2" />;
    }
    if (separator === 'slash') {
      return <span className="text-gray-400 mx-2">/</span>;
    }
    return <span className="text-gray-400 mx-2">›</span>;
  };

  if ( breadcrumbs.length > 0 ) {
    breadcrumbs.map((crumb, idx) => {
      defaultCrumbs.push(crumb);
    })
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm ${className}`}>
      {defaultCrumbs.map((crumb, index) => (
        <div key={crumb.id || index} className="flex items-center">
          {index > 0 && renderSeparator()}
          
          <button
            onClick={() => onBreadcrumbClick && onBreadcrumbClick(crumb, index)}
            className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
              crumb.active || crumb.isLast
                ? 'text-gray-600 cursor-default font-medium' 
                : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
            } ${crumb.disabled ? 'text-gray-400 cursor-not-allowed' : ''}`}
            disabled={crumb.active || crumb.isLast || crumb.disabled}
          >
            {index === 0 && showHomeIcon && <Home size={16} />}
            <span>{crumb.label}</span>
          </button>
        </div>
      ))}
    </nav>
  );
};

export default BreadCrumbs;
