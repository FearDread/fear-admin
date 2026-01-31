import { ThunkFactory } from "@feardread/feature-factory";

ThunkFactory.setApiUrl('http://localhost:4000/fear/api');

export const ReviewService = {
  // Get reviews by product
  getReviewsByProduct: ThunkFactory.custom('review', 'by-product', {
    method: 'GET',
    useParams: false,
  }),
  
  // Get reviews by user
  getReviewsByUser: ThunkFactory.custom('review', 'by-user', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get verified reviews
  getVerifiedReviews: ThunkFactory.custom('review', 'verified', {
    method: 'GET',
  }),
  
  // Get featured reviews
  getFeaturedReviews: ThunkFactory.custom('review', 'featured', {
    method: 'GET',
  }),
  
  // Get recent reviews
  getRecentReviews: ThunkFactory.custom('review', 'recent', {
    method: 'GET',
    useParams: true,
  }),

  // Create a new review
  create: ThunkFactory.custom('review', 'new', {
    method: 'POST',
    useParams: false
  }),

  // Update a review
  update: ThunkFactory.custom('review', 'update', {
    method: 'PUT',
    useParams: true
  }),

  // Mark review as helpful
  markHelpful: ThunkFactory.custom('review', 'helpful', {
    method: 'POST',
    useParams: true
  }),

  // Report a review
  report: ThunkFactory.custom('review', 'report', {
    method: 'POST',
    useParams: true
  }),
};

export default ReviewService;