'use client';

import Link from 'next/link';

interface CategoryLink {
  label: string;
  path: string;
}

interface CatDropdownProps {
  categories: Record<string, CategoryLink[]>;
  onClose?: () => void;
}

export const CatDropdown = ({ categories, onClose }: CatDropdownProps) => {
  return (
    <div className="hdr-category-dropdown hdr-drawer-head">
      <div className="row" style={{ margin: '0' }}>
        {Object.entries(categories).map(([title, items]) => (
          <div key={title} className="col-md-4">
            <h6 className="large-menu-title">{title}</h6>
            <ul>
              {items.map((item) => (
                <li key={item.label}>
                  <Link href={item.path} onClick={onClose} className="hdr-drawer-cat-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-md-2">
          <div className="pramotion-banner1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/comics/banner/01.png" className="img-fluid" alt="Promotion" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDropdown;
