import { ThunkFactory } from "@feardread/feature-factory";


ThunkFactory.setApiUrl('http://localhost:4000/fear/api');
/**
 * Create custom async thunks for products
 */
export const ProductService = {
  // Search products
  //searchProducts: ThunkFactory.post('product', 'search'),
  
  // Get products by category
  getProductsByCategory: ThunkFactory.custom('product', 'by-category', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get products by brand
  getProductsByBrand: ThunkFactory.custom('product', 'by-brand', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get featured products
  getFeaturedProducts: ThunkFactory.custom('product', 'featured', {
    method: 'GET',
  }),
  
  // Get product recommendations
  getTrendingProducts: ThunkFactory.custom('product', 'trending', {
    method: 'GET',
    useParams: true,
  }),

  create: ThunkFactory.custom('product', 'create', {
    method:'POST',
    useParams: false
  }),
};

export default ProductService;