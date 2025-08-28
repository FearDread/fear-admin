

export const SortDropdown = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: null, label: 'Default sorting' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'latest', label: 'Latest' },
    { value: 'price_low_high', label: 'Price: Low to High' },
    { value: 'price_high_low', label: 'Price: High to Low' },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Default sorting';

  return (
    <div className="right-section-btn d-flex align-items-center">
      <div className="dropdown">
        <button 
          className="btn dropdown-toggle" 
          type="button" 
          id="dropdownMenuButton1" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          {currentSortLabel}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          {sortOptions.map((option) => (
            <li key={option.value || 'default'}>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onSortChange(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SortDropdown;