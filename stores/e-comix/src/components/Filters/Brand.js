import { Link } from 'react-router-dom';

export const BrandFilter = ({ brands, selectedBrand, onBrandChange }) => (
  <div className="accordion-item mt-4">
    <h2 className="accordion-header">
      <button 
        className="accordion-button" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#panelsStayOpen-collapsesix"
      >
        Top Brands
      </button>
    </h2>
    <div id="panelsStayOpen-collapsesix" className="accordion-collapse collapse show">
      <div className="accordion-body">
        <ul className="d-flex pol-btn align-items-center">
          {brands.map((brand) => (
            <li key={brand._id}>
              <button
                type="button"
                className={`btn ${selectedBrand === brand._id ? 'active' : ''}`}
                onClick={() => onBrandChange(brand._id)}
              >
                {brand.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default BrandFilter;
