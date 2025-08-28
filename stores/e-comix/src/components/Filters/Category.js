import React from 'react';
import CategoryCheck from '../Common/CategoryCheck';

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => (
  <div className="accordion-item">
    <h2 className="accordion-header">
      <button 
        className="accordion-button" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#panelsStayOpen-collapseOne" 
        aria-expanded="true" 
        aria-controls="panelsStayOpen-collapseOne"
      >
        <span>Categories</span>
      </button>
    </h2>
    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
      <div className="accordion-body">
        {categories?.map((category) => (
          <CategoryCheck 
            {...category} 
            key={category._id}
            isSelected={selectedCategory === category._id}
            onChange={() => onCategoryChange(category._id)}
          />
        ))}
      </div>
    </div>
  </div>
);

export default CategoryFilter;