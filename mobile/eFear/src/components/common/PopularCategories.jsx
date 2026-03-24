import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchCategories,
    selectParentCategories,
    selectSubcategoriesByParent,
    selectCategoriesLoading,
    selectCategoriesSuccess
} from "../../features/categories/slice";

export const PopularCategories = () => {
    const dispatch = useDispatch();
    const parentCategories = useSelector(selectParentCategories);
    const subCategories = useSelector(selectSubcategoriesByParent);
    const loading = useSelector(selectCategoriesLoading);
    const success = useSelector(selectCategoriesSuccess);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Helper function to get subcategories for a parent
    const getSubcategories = (parentId) => {
        return subCategories;
    };

    // Helper function to get category image
    const getCategoryImage = (category, index) => {
        if (category.image || category.imageUrl) {
            return category.image || category.imageUrl;
        }
        return `assets/images/shop-categories/${String(index + 1).padStart(2, '0')}.png`;
    };

    // Fallback categories if none loaded
    const fallbackCategories = [
        {
            id: 'clothing',
            name: 'Clothing',
            subcategories: [
                { name: 'Blazers & Suits', count: 14 },
                { name: 'Dresses', count: 2 },
                { name: 'Sportswear', count: 1 },
                { name: 'Hoodie & Sweatshirts', count: 1 }
            ]
        },
        {
            id: 'accessories',
            name: 'Accessories',
            subcategories: [
                { name: 'Bags', count: 14 },
                { name: 'Sunglasses', count: 22 },
                { name: 'Jewelry', count: 14 },
                { name: 'Cosmetics', count: 12 }
            ]
        },
        {
            id: 'shoes',
            name: 'Shoes',
            subcategories: [
                { name: 'Sandals', count: 14 },
                { name: 'Boots', count: 20 },
                { name: 'Ballerinas & Flats', count: 16 },
                { name: 'Flip Flops', count: 18 }
            ]
        },
        {
            id: 'furniture',
            name: 'Furniture',
            subcategories: [
                { name: 'Tables', count: 14 },
                { name: 'Office Chairs', count: 2 },
                { name: 'Adjustable Height Desks', count: 1 },
                { name: 'Lounge Seating', count: 1 }
            ]
        },
        {
            id: 'electronics',
            name: 'Electronics',
            subcategories: [
                { name: 'Mobiles', count: 25 },
                { name: 'Laptops', count: 42 },
                { name: 'Headphones', count: 14 },
                { name: 'Computers & Accessories', count: 10 }
            ]
        },
        {
            id: 'makeup',
            name: 'Makeup Kit',
            subcategories: [
                { name: 'Skin & Eye Primer', count: 16 },
                { name: 'Eyeshadow', count: 18 },
                { name: 'Lipstick Palette', count: 26 },
                { name: 'Excellent Brow', count: 16 }
            ]
        },
        {
            id: 'jewelry',
            name: 'Jewelry',
            subcategories: [
                { name: 'Bridal', count: 25 },
                { name: 'Fashion', count: 42 },
                { name: 'Temple', count: 14 },
                { name: 'Handmade', count: 10 }
            ]
        },
        {
            id: 'sports',
            name: 'Sports',
            subcategories: [
                { name: 'Soccer/football', count: 12 },
                { name: 'Badminton', count: 35 },
                { name: 'Table Tennis', count: 10 },
                { name: 'Volleyball', count: 15 }
            ]
        }
    ];

    // Use Redux categories if available, otherwise use fallback
    const displayCategories = success && parentCategories.length > 0 
        ? parentCategories.slice(0, 8) 
        : fallbackCategories;

    return (
        <>
            <section className="py-4">
                <div className="container">
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading categories...</span>
                            </div>
                        </div>
                    )}
                    
                    <div className="product-categories">
                        <div className="row row-cols-1 row-cols-lg-4">
                            {displayCategories.map((category, index) => {
                                const subcategories = category.subcategories

                                                        
                                
                                return (
                                    <div className="col" key={category.id || category._id || index}>
                                        <div className="card rounded-0 product-card">
                                            <Link to={`/category/${category.id || category._id || category.slug}`}>
                                                <img 
                                                    src={getCategoryImage(category, index)} 
                                                    className="card-img-top border-bottom bg-dark-1" 
                                                    alt={category.name || category.title} 
                                                />
                                            </Link>
                                            <div className="list-group list-group-flush">
                                                <Link 
                                                    to={`/category/${category.id || category._id || category.slug}`} 
                                                    className="list-group-item bg-transparent"
                                                >
                                                    <h6 className="mb-0 text-uppercase">
                                                        {category.name || category.title}
                                                    </h6>
                                                </Link>
                                                {subCategories.slice(0, 4).map((subcategory, subIndex) => (
                                                    <Link
                                                        key={subcategory.id || subcategory._id || subIndex}
                                                        to={`/category/${subcategory.id || subcategory._id || subcategory.slug}`}
                                                        className="list-group-item bg-transparent d-flex justify-content-between align-items-center"
                                                    >
                                                        {subcategory.name || subcategory.title}
                                                        <span className="badge bg-light rounded-pill">
                                                            {subcategory.productCount || subcategory.count || 0}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default PopularCategories;