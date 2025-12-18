import { ThunkFactory } from "@feardread/feature-factory";


/**
 * Create custom async thunks for products
 */
export const ProductService = {
  // Search products
  searchProducts: ThunkFactory.post('products', 'search'),
  
  // Get products by category
  getProductsByCategory: ThunkFactory.custom('products', 'by-category', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get products by brand
  getProductsByBrand: ThunkFactory.custom('products', 'by-brand', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get featured products
  getFeaturedProducts: ThunkFactory.custom('products', 'featured', {
    method: 'GET',
  }),
  
  // Get product recommendations
  getRecommendations: ThunkFactory.custom('products', 'recommendations', {
    method: 'GET',
    useParams: true,
  }),
};

export default ProductService;