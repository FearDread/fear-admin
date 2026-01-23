import { ThunkFactory } from "@feardread/feature-factory"

export const BrandService = {
      // Get featured brands
  getFeaturedBrands: ThunkFactory.custom('brand', 'featured', {
    method: 'GET',
  }),
  
  // Get popular brands
  getPopularBrands: ThunkFactory.custom('brand', 'popular', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get brands by category
  getBrandsByCategory: ThunkFactory.custom('brand', 'by-category', {
    method: 'GET',
    useParams: true,
  }),

  customCreateBrand: ThunkFactory.custom('brand', 'new', {
    method: 'POST',
    useParams: false
  })
}

export default BrandService;