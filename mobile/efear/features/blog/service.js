// features/blog/service.js
import { ThunkFactory } from "@feardread/feature-factory";

export const BlogService = {
  // Get posts by category
  getPostsByCategory: ThunkFactory.custom('blog', 'by-category', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get posts by author
  getPostsByAuthor: ThunkFactory.custom('blog', 'by-author', {
    method: 'GET',
    useParams: true,
  }),

  // Get posts by tag
  getPostsByTag: ThunkFactory.custom('blog', 'by-tag', {
    method: 'GET',
    useParams: true,
  }),
  
  // Get featured posts
  getFeaturedPosts: ThunkFactory.custom('blog', 'featured', {
    method: 'GET',
  }),
  
  // Get published posts
  getPublishedPosts: ThunkFactory.custom('blog', 'published', {
    method: 'GET',
    useParams: true,
  }),

  // Toggle publish status
  togglePublish: ThunkFactory.custom('blog', 'publish', {
    method: 'PATCH',
    useParams: true,
  }),

  // Schedule post
  schedulePost: ThunkFactory.custom('blog', 'schedule', {
    method: 'PATCH',
    useParams: false,
  }),

  // Custom create with additional processing
  customCreatePost: ThunkFactory.custom('blog', 'new', {
    method: 'POST',
    useParams: false
  }),
};

export default BlogService;