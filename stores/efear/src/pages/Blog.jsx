import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchPosts,
    selectSortedPosts,
    selectLoading,
    selectError,
    setSearchTerm,
    setFilters,
    selectSearchTerm,
    selectFilters
} from "../features/blog/slice";
import {
    fetchCategories,
    selectVisibleCategories,
    selectCategoriesLoading
} from "../features/categories/slice";

export const Blog = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector(selectSortedPosts);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const searchTerm = useSelector(selectSearchTerm);
    const filters = useSelector(selectFilters);
    const categories = useSelector(selectVisibleCategories);
    const categoriesLoading = useSelector(selectCategoriesLoading);

    const [localSearchTerm, setLocalSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearchTerm(localSearchTerm));
    };

    const handleCategoryFilter = (categoryId) => {
        dispatch(setFilters({ ...filters, categoryId }));
    };

    const clearFilters = () => {
        dispatch(setFilters({ categoryId: null }));
        dispatch(setSearchTerm(""));
        setLocalSearchTerm("");
    };

    const displayPosts = posts.slice(0, 3);

    return (
        <>
            <section className="py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-9">
                            <div className="blog-right-sidebar p-3">
                                {loading && (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {!loading && !error && displayPosts.length === 0 && (
                                    <div className="alert alert-info" role="alert">
                                        No posts found.
                                    </div>
                                )}

                                {!loading && displayPosts.map((post, index) => (
                                    <div className="card media-object" key={post._id || index}>
                                        <img
                                            src={post.images ? post.images[0].url : `assets/images/posts/0${index + 1}.png`}
                                            className="blog-card-img-top"
                                            alt={post.title || "Post image"}
                                        />
                                        <div className="card-body">
                                            <div className="list-inline">
                                                <a href="javascript:;" className="list-inline-item">
                                                    <i className='bx bx-user me-1'></i>
                                                    By Admin{/* {post.author || post.authorName || "Admin"}*/}
                                                </a>
                                                <a href="javascript:;" className="list-inline-item">
                                                    <i className='bx bx-comment-detail me-1'></i>
                                                    {post.commentsCount || post.comments || 0} Comments
                                                </a>
                                                <a href="javascript:;" className="list-inline-item">
                                                    <i className='bx bx-calendar me-1'></i>
                                                    {post.publishedDate || post.createdAt
                                                        ? new Date(post.publishedDate || post.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : "November 5, 2021"}
                                                </a>
                                            </div>
                                            <h4 className="mt-4">{post.title || "Post Title Here"}</h4>
                                            <p>
                                                {post.excerpt || post.content
                                                    ? (post.excerpt || post.content).substring(0, 250) + "..."
                                                    : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."}
                                            </p>
                                            <Link to={`/blog/${post._id}`}
                                                className="btn btn-light btn-ecomm"
                                            >
                                                Read More <i className='bx bx-chevrons-right'></i>
                                            </Link>
                                        </div>
                                    </div>
                                ))}

                                <hr />
                                {/* <Navigation5 /> */}
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
                                        {filters.categoryId && (
                                            <button 
                                                className="btn btn-sm btn-outline-secondary mb-3 w-100"
                                                onClick={clearFilters}
                                            >
                                                <i className='bx bx-x me-1'></i> Clear Filter
                                            </button>
                                        )}
                                        <div className="list-group list-group-flush">
                                            {categoriesLoading ? (
                                                <div className="text-center py-3">
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                </div>
                                            ) : categories && categories.length > 0 && (
                                                categories.map((category) => (
                                                    <Link
                                                        key={category.id || category._id}
                                                        to="/blog"
                                                        className={`list-group-item bg-transparent ${
                                                            filters.categoryId === (category.id || category._id) ? 'active' : ''
                                                        }`}
                                                        onClick={() => handleCategoryFilter(category.id || category._id)}
                                                    >
                                                        <i className='bx bx-chevron-right me-1'></i> 
                                                        {category.name || category.title}
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="blog-categories mb-3">
                                        <h5 className="mb-4">Recent Posts</h5>
                                        {posts.slice(0, 4).map((post, index) => (
                                            <React.Fragment key={post._id || post.id || index}>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={post.thumbnail || (post.images && post.images[0]?.url) || `assets/images/gallery/0${(index % 4) + 1}.png`}
                                                        width="75"
                                                        alt={post.title || "Recent post"}
                                                    />
                                                    <div className="ms-3">
                                                        <Link 
                                                            to={`/blog/${post._id || post.id}`} 
                                                            className="fs-6"
                                                        >
                                                            {(post.title || "Post title here").substring(0, 50)}
                                                            {post.title && post.title.length > 50 ? '...' : ''}
                                                        </Link>
                                                        <p className="mb-0">
                                                            {post.publishedDate || post.createdAt
                                                                ? new Date(post.publishedDate || post.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })
                                                                : "March 15, 2021"}
                                                        </p>
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
};

export default Blog;