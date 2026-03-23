import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { 
  setSearchTerm,
  setFilters,
  selectAllProducts 
} from '../../features/products/slice';
import { 
  fetchCategories,
  selectAllCategories 
} from '../../features/categories/slice';


export const CatDropdown = ({ categories: categoryData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
   // Redux selector
    const categories = useSelector(selectAllCategories);
    const products = useSelector(selectAllProducts);
    const categoriesLoading = useSelector(state => state.categories?.loading);
  
    // Local state
    const [searchTerm, setSearchTermLocal] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const handleCat = (term) => {
    term.trim().toLowerCase();
    setSearchTerm(term);
        console.log('search with ', term);
    dispatch(setSearchTerm(term))
    //handleSearch();


  }

  return (
    <div className="hdr-category-dropdown hdr-drawer-head">
      <div className="row" style={{margin:'0'}}>
        {Object.entries(categoryData).map(([title, items], idx) => (
          <div key={title} className="col-md-4">
            <h6 className="large-menu-title">{title}</h6>
            <ul>
              {items.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} onClick={() => handleCat(item.term)} className="hdr-drawer-cat-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-md-2">
          <div className="pramotion-banner1">
            <img src="assets/images/comics/banner/01.png" className="img-fluid" alt="Promotion" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatDropdown
