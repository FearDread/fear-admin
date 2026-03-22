import { ThunkFactory } from "@feardread/feature-factory"

export const brandService = {
      // Get featured brands
  getFeaturedBrands: ThunkFactory.custom('brands', 'featured', {
    method: 'GET',
  }),
  
  // Get popular brands
  getPopularBrands: ThunkFactory.custom('brands', 'popular', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get brands by category
  getBrandsByCategory: ThunkFactory.custom('brands', 'by-category', {
    method: 'GET',
    useParams: true,
  }),
}

export default brandService;