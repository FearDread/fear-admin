import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchPost,
  fetchPosts,
  selectCurrentPost,
  selectAllPosts,
  selectLoading,
  selectError,
  incrementViews,
  setSearchTerm,
  setFilters,
} from "../features/blog/slice";

const BlogPost = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const currentPost = useSelector(selectCurrentPost);
  const allPosts = useSelector(selectAllPosts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [comment, setComment] = useState({
    text: "",
    name: "",
    email: "",
    website: ""
  });

  useEffect(() => {
          console.log('post id = ', id);
    if (id) {

      dispatch(fetchPost({ id: id }));
      dispatch(incrementViews(id));
    }
    dispatch(fetchPosts());
  }, [dispatch, id]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearchTerm));
  };

  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ categoryId: category }));
  };

  const handleCommentChange = (field, value) => {
    setComment(prev => ({ ...prev, [field]: value }));
  };

  const handleCommentSubmit = () => {
    console.log("Comment submitted:", comment);
    // Add comment submission logic here
    setComment({ text: "", name: "", email: "", website: "" });
  };

  const latestPosts = allPosts.slice(0, 6);
  const recentPosts = allPosts.slice(0, 4);

  const formatDate = (dateString) => {
    if (!dateString) return "November 5, 2021";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDateParts = (dateString) => {
    if (!dateString) return { day: "24", month: "FEB" };
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    };
  };

  if (loading && !currentPost) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  const post = currentPost || {};

  return (
    <>
      <section className="py-3 border-bottom d-none d-md-flex">
        <div className="container">
          <div className="page-breadcrumb d-flex align-items-center">
            <h3 className="breadcrumb-title pe-3">Single Post</h3>
            <div className="ms-auto"></div>
          </div>
        </div>
      </section>

      <section className="py-4">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-9">
              <div className="blog-right-sidebar p-3">
                <div className="card shadow-none bg-transparent">
                  <img 
                    src={post.images ? post.images[0].url : "assets/images/posts/01.png"} 
                    className="card-img-top" 
                    alt={post.title || "Post image"} 
                  />
                  <div className="card-body p-0">
                    <div className="list-inline mt-4">
                      <a href="javascript:;" className="list-inline-item">
                        <i className='bx bx-user me-1'></i>
                        By {post.author || post.authorName || "Admin"}
                      </a>
                      <a href="javascript:;" className="list-inline-item">
                        <i className='bx bx-comment-detail me-1'></i>
                        {post.commentsCount || post.comments || 0} Comments
                      </a>
                      <a href="javascript:;" className="list-inline-item">
                        <i className='bx bx-calendar me-1'></i>
                        {formatDate(post.publishedDate || post.createdAt)}
                      </a>
                    </div>
                    
                    <h4 className="mt-4">{post.title || "Post Title Here"}</h4>
                    
                    {post.content ? (
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    ) : (
                      <>
                        <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.</p>
                        <p>Nam dolor ligula, faucibus id sodales in, auctor fringilla libero. Pellentesque pellentesque tempor tellus eget hendrerit. Morbi id aliquam ligula. Aliquam id dui sem. Proin rhoncus consequat nisl, eu ornare mauris tincidunt vitae.</p>
                      </>
                    )}

                    <div className="d-flex align-items-center gap-2 py-4 border-top border-bottom">
                      <div>
                        <h6 className="mb-0 text-uppercase">Share This Post</h6>
                      </div>
                      <div className="list-inline blog-sharing">
                        <a href="javascript:;" className="list-inline-item">
                          <i className='bx bxl-facebook'></i>
                        </a>
                        <a href="javascript:;" className="list-inline-item">
                          <i className='bx bxl-twitter'></i>
                        </a>
                        <a href="javascript:;" className="list-inline-item">
                          <i className='bx bxl-linkedin'></i>
                        </a>
                        <a href="javascript:;" className="list-inline-item">
                          <i className='bx bxl-instagram'></i>
                        </a>
                        <a href="javascript:;" className="list-inline-item">
                          <i className='bx bxl-tumblr'></i>
                        </a>
                      </div>
                    </div>
                  </div>

                  {post.authorBio && (
                    <div className="author d-flex align-items-center gap-3 py-4">
                      <img 
                        src={post.authorAvatar || "assets/images/avatars/avatar-1.png"} 
                        alt={post.author || "Author"} 
                        width="80" 
                      />
                      <div>
                        <h6 className="mb-0">{post.author || post.authorName || "John Doe"}</h6>
                        <p className="mb-0">{post.authorBio}</p>
                      </div>
                    </div>
                  )}

                  <div className="reply-form p-4 border bg-dark-1">
                    <h6 className="mb-0">Leave a Reply</h6>
                    <p>Your email address will not be published. Required fields are marked *</p>
                    
                    <div className="mb-3">
                      <label className="form-label">Comment</label>
                      <textarea 
                        className="form-control" 
                        rows="4"
                        value={comment.text}
                        onChange={(e) => handleCommentChange('text', e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder=""
                        value={comment.name}
                        onChange={(e) => handleCommentChange('name', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control"
                        value={comment.email}
                        onChange={(e) => handleCommentChange('email', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Website</label>
                      <input 
                        type="text" 
                        className="form-control"
                        value={comment.website}
                        onChange={(e) => handleCommentChange('website', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <button 
                        type="button" 
                        className="btn btn-light btn-ecomm"
                        onClick={handleCommentSubmit}
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>

                <div className="product-grid mt-4">
                  <h5 className="text-uppercase mb-4">Latest Posts</h5>
                  <div className="row">
                    {latestPosts.map((latestPost, index) => {
                      const dateParts = getDateParts(latestPost.publishedDate || latestPost.createdAt);
                      return (
                        <div className="col-md-6 col-lg-4 mb-4" key={latestPost.id || index}>
                          <div className="card rounded-0 product-card border">
                            <div className="news-date">
                              <div className="date-number">{dateParts.day}</div>
                              <div className="date-month">{dateParts.month}</div>
                            </div>
                            <a href={`single.html?id=${latestPost.id}`}>
                              <img 
                                src={latestPost.images[0].url || `assets/images/blogs/0${(index % 6) + 1}.png`} 
                                className="card-img-top border-bottom bg-dark-1" 
                                alt={latestPost.title || "Blog post"} 
                              />
                            </a>
                            <div className="card-body">
                              <div className="news-title">
                                <a href={`single.html?id=${latestPost.id}`}>
                                  <h5 className="mb-3 text-capitalize">
                                    {latestPost.title || "Blog Short Title"}
                                  </h5>
                                </a>
                              </div>
                              <p className="news-content mb-0">
                                {latestPost.excerpt 
                                  ? latestPost.excerpt.substring(0, 100) + "..."
                                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non placerat mi..."}
                              </p>
                            </div>
                            <div className="card-footer border-top">
                              <a href="javascript:;">
                                <p className="mb-0">
                                  <small className="text-white">
                                    {latestPost.commentsCount || latestPost.comments || 0} Comments
                                  </small>
                                </p>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-3">
              <div className="blog-left-sidebar p-3">
                <div>
                  <div className="position-relative blog-search mb-3">
                    <input 
                      type="text" 
                      className="form-control form-control-lg rounded-0 pe-5" 
                      placeholder="Search posts here..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    />
                    <div 
                      className="position-absolute top-50 end-0 translate-middle"
                      onClick={handleSearch}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className='bx bx-search fs-4 text-white'></i>
                    </div>
                  </div>

                  <div className="blog-categories mb-3">
                    <h5 className="mb-4">Blog Categories</h5>
                    <div className="list-group list-group-flush">
                      <a 
                        href="javascript:;" 
                        className="list-group-item bg-transparent"
                        onClick={() => handleCategoryFilter('fashion')}
                      >
                        <i className='bx bx-chevron-right me-1'></i> Fashion
                      </a>
                      <a 
                        href="javascript:;" 
                        className="list-group-item bg-transparent"
                        onClick={() => handleCategoryFilter('electronics')}
                      >
                        <i className='bx bx-chevron-right me-1'></i> Electronics
                      </a>
                      <a 
                        href="javascript:;" 
                        className="list-group-item bg-transparent"
                        onClick={() => handleCategoryFilter('accessories')}
                      >
                        <i className='bx bx-chevron-right me-1'></i> Accessories
                      </a>
                      <a 
                        href="javascript:;" 
                        className="list-group-item bg-transparent"
                        onClick={() => handleCategoryFilter('kitchen')}
                      >
                        <i className='bx bx-chevron-right me-1'></i> Kitchen & Table
                      </a>
                      <a 
                        href="javascript:;" 
                        className="list-group-item bg-transparent"
                        onClick={() => handleCategoryFilter('furniture')}
                      >
                        <i className='bx bx-chevron-right me-1'></i> Furniture
                      </a>
                    </div>
                  </div>

                  <div className="blog-categories mb-3">
                    <h5 className="mb-4">Recent Posts</h5>
                    {recentPosts.map((recentPost, index) => (
                      <React.Fragment key={recentPost.id || index}>
                        <div className="d-flex align-items-center">
                          <img 
                            src={recentPost.images[0].url || `assets/images/gallery/0${(index % 4) + 1}.png`} 
                            width="75" 
                            alt={recentPost.title || "Recent post"} 
                          />
                          <div className="ms-3">
                            <a href={`single.html?id=${recentPost.id}`} className="fs-6">
                              {recentPost.title || "Post title here"}
                            </a>
                            <p className="mb-0">{formatDate(recentPost.publishedDate || recentPost.createdAt)}</p>
                          </div>
                        </div>
                        {index < 3 && <div className="my-3 border-bottom"></div>}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="blog-categories mb-3">
                    <h5 className="mb-4">Popular Tags</h5>
                    <div className="tags-box">
                      <a href="javascript:;" className="tag-link">Cloths</a>
                      <a href="javascript:;" className="tag-link">Electronics</a>
                      <a href="javascript:;" className="tag-link">Furniture</a>
                      <a href="javascript:;" className="tag-link">Sports</a>
                      <a href="javascript:;" className="tag-link">Men Wear</a>
                      <a href="javascript:;" className="tag-link">Women Wear</a>
                      <a href="javascript:;" className="tag-link">Laptops</a>
                      <a href="javascript:;" className="tag-link">Formal Shirts</a>
                      <a href="javascript:;" className="tag-link">Topwear</a>
                      <a href="javascript:;" className="tag-link">Headphones</a>
                      <a href="javascript:;" className="tag-link">Bottom Wear</a>
                      <a href="javascript:;" className="tag-link">Bags</a>
                      <a href="javascript:;" className="tag-link">Sofa</a>
                      <a href="javascript:;" className="tag-link">Shoes</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogPost;