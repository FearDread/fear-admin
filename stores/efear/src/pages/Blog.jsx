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
    selectFilters,
} from "../features/blog/slice";
import {
    fetchCategories,
    selectVisibleCategories,
    selectCategoriesLoading,
} from "../features/categories/slice";
import { T, blogStyles } from "../components/styles";


/* ─────────────────────────────────────────────
   ACCENT COLORS per tag index
───────────────────────────────────────────────*/
const TAG_COLORS = [T.red, T.orange, T.teal, T.red, T.orange];

const POPULAR_TAGS = [
    'Comics', 'Manga', 'E-Books', 'Trading Cards', 'Pokémon',
    'Marvel', 'DC', 'Collectibles', 'Graphic Novels', 'Anime',
    'Dark Horse', 'Image Comics', 'Reviews', 'New Arrivals',
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────*/
const formatDate = (dateStr) => {
    if (!dateStr) return 'November 5, 2021';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
};

const getPostImage = (post, index) =>
    post.images?.[0]?.url || `assets/images/posts/0${(index % 4) + 1}.png`;

/* ─────────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────────────*/
const BlogSkeleton = () => (
    <div className="blog-skeleton">
        {/* Featured skeleton */}
        <div className="blog-skel-block">
            <div className="blog-skel-img" />
            <div className="blog-skel-body">
                <div className="blog-skel-line" style={{ width: '30%' }} />
                <div className="blog-skel-line" style={{ width: '75%', height: 22 }} />
                <div className="blog-skel-line" style={{ width: '90%' }} />
                <div className="blog-skel-line" style={{ width: '60%', marginBottom: 0 }} />
            </div>
        </div>
        {/* Row skeletons */}
        {[1, 2].map(i => (
            <div className="blog-skel-block" key={i}>
                <div className="blog-skel-row">
                    <div className="blog-skel-thumb" />
                    <div className="blog-skel-row-body">
                        <div className="blog-skel-line" style={{ width: '25%', marginBottom: '.85rem' }} />
                        <div className="blog-skel-line" style={{ width: '80%', height: 16 }} />
                        <div className="blog-skel-line" style={{ width: '95%' }} />
                        <div className="blog-skel-line" style={{ width: '40%', marginBottom: 0 }} />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

/* ─────────────────────────────────────────────
   BLOG COMPONENT
───────────────────────────────────────────────*/
export const Blog = () => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();

    const posts              = useSelector(selectSortedPosts);
    const loading            = useSelector(selectLoading);
    const error              = useSelector(selectError);
    const searchTerm         = useSelector(selectSearchTerm);
    const filters            = useSelector(selectFilters);
    const categories         = useSelector(selectVisibleCategories);
    const categoriesLoading  = useSelector(selectCategoriesLoading);

    const [localSearchTerm, setLocalSearchTerm] = useState('');
    const [activeTag, setActiveTag]             = useState('');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [visibleCount, setVisibleCount]       = useState(6);

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchCategories());
    }, [dispatch]);

    /* ── Handlers (all original logic preserved) ── */
    const handleSearch = (e) => {
        e?.preventDefault();
        dispatch(setSearchTerm(localSearchTerm));
    };

    const handleCategoryFilter = (categoryId) => {
        dispatch(setFilters({ ...filters, categoryId }));
    };

    const clearFilters = () => {
        dispatch(setFilters({ categoryId: null }));
        dispatch(setSearchTerm(''));
        setLocalSearchTerm('');
        setActiveTag('');
    };

    /* ── Derived data ── */
    const displayPosts  = posts.slice(0, visibleCount);
    const featuredPost  = displayPosts[0];
    const regularPosts  = displayPosts.slice(1);
    const hasMore       = posts.length > visibleCount;

    return (
        <>
            <style>{blogStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet" />

            <div className="blog-page">

                {/* ── PAGE HERO ── */}
                <section className="blog-hero">
                    <div className="blog-hero-ghost" aria-hidden="true">BLOG</div>
                    <div className="blog-hero-stripe" />
                    <div className="blog-hero-inner">
                        <div className="blog-breadcrumb">
                            <Link to="/" className="blog-bc-link">Home</Link>
                            <span className="blog-bc-sep">✦</span>
                            <span className="blog-bc-current">Blog</span>
                        </div>
                        <span className="blog-eyebrow">From the Long Box</span>
                        <h1 className="blog-hero-title">The <span>Blog</span></h1>
                        <div className="blog-hero-meta">
                            <span className="blog-hero-meta-item">
                                <span>✦</span> {posts.length || '—'} articles
                            </span>
                            <span className="blog-hero-meta-item">
                                <span>✦</span> {categories.length || '—'} categories
                            </span>
                            <span className="blog-hero-meta-item">
                                <span>✦</span> Updated weekly
                            </span>
                        </div>
                    </div>
                </section>

                {/* ── MAIN CONTENT ── */}
                <div className="blog-layout">

                    {/* ── POSTS COLUMN ── */}
                    <main>
                        {/* Header row */}
                        <div className="blog-posts-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
                                <h2 className="blog-posts-title">
                                    Latest <span>Posts</span>
                                </h2>
                                {!loading && (
                                    <span className="blog-posts-count">{posts.length} articles</span>
                                )}
                                {(filters.categoryId || searchTerm) && (
                                    <button className="blog-clear-chip" onClick={clearFilters}>
                                        ✕ Clear filters
                                    </button>
                                )}
                            </div>
                            <select className="blog-sort-select">
                                <option>Newest First</option>
                                <option>Oldest First</option>
                                <option>Most Popular</option>
                            </select>
                        </div>

                        {/* Error state */}
                        {error && (
                            <div className="blog-error">
                                <span className="blog-error-icon">!</span>
                                <div>
                                    <p className="blog-error-title">Failed to load posts</p>
                                    <p className="blog-error-msg">{typeof error === 'string' ? error : 'Something went wrong. Try refreshing.'}</p>
                                </div>
                            </div>
                        )}

                        {/* Skeleton */}
                        {loading && <BlogSkeleton />}

                        {/* Empty state */}
                        {!loading && !error && posts.length === 0 && (
                            <div className="blog-empty">
                                <span className="blog-empty-icon">📰</span>
                                <h3 className="blog-empty-title">No posts found</h3>
                                <p className="blog-empty-sub">
                                    {searchTerm || filters.categoryId
                                        ? 'Try clearing your filters to see all posts.'
                                        : "We're still writing. Check back soon."}
                                </p>
                                {(searchTerm || filters.categoryId) && (
                                    <button className="blog-card-cta-ghost" onClick={clearFilters}>
                                        Clear Filters →
                                    </button>
                                )}
                            </div>
                        )}

                        {/* ── FEATURED POST (first) ── */}
                        {!loading && featuredPost && (
                            <article className="blog-card-featured">
                                <div className="blog-card-featured-img-wrap">
                                    <img
                                        src={getPostImage(featuredPost, 0)}
                                        alt={featuredPost.title || 'Featured post'}
                                        className="blog-card-featured-img"
                                    />
                                    <div className="blog-card-featured-overlay" />
                                    <span className="blog-card-featured-badge">Featured</span>
                                    {featuredPost.category && (
                                        <span className="blog-card-featured-cat">{featuredPost.category}</span>
                                    )}
                                </div>
                                <div className="blog-card-featured-body">
                                    <div className="blog-card-featured-meta">
                                        <span className="blog-card-meta-item">
                                            👤 &nbsp; Admin
                                        </span>
                                        <span className="blog-card-meta-dot">✦</span>
                                        <span className="blog-card-meta-item">
                                            💬 &nbsp; {featuredPost.commentsCount || featuredPost.comments || 0} Comments
                                        </span>
                                        <span className="blog-card-meta-dot">✦</span>
                                        <span className="blog-card-meta-item">
                                            📅 &nbsp; {formatDate(featuredPost.publishedDate || featuredPost.createdAt)}
                                        </span>
                                    </div>
                                    <Link
                                        to={`/blog/${featuredPost._id}`}
                                        className="blog-card-featured-title"
                                    >
                                        {featuredPost.title || 'Post Title Here'}
                                    </Link>
                                    <p className="blog-card-featured-excerpt">
                                        {featuredPost.excerpt || featuredPost.content
                                            ? (featuredPost.excerpt || featuredPost.content).substring(0, 260) + '…'
                                            : 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.'}
                                    </p>
                                    <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                                        <Link to={`/blog/${featuredPost._id}`} className="blog-card-cta">
                                            Read Article →
                                        </Link>
                                        <Link to="/blog" className="blog-card-cta-ghost">
                                            All Posts
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )}

                        {/* ── REGULAR POST CARDS ── */}
                        {!loading && regularPosts.map((post, index) => (
                            <article className="blog-card" key={post._id || index}>
                                <div className="blog-card-img-wrap">
                                    <img
                                        src={getPostImage(post, index + 1)}
                                        alt={post.title || 'Post image'}
                                    />
                                    <div className="blog-card-img-overlay" />
                                </div>
                                <div className="blog-card-body">
                                    <span
                                        className="blog-card-cat-tag"
                                        style={{ '--tag-color': TAG_COLORS[index % TAG_COLORS.length] }}
                                    >
                                        {post.category || 'Articles'}
                                    </span>
                                    <Link to={`/blog/${post._id}`} className="blog-card-title">
                                        {post.title || 'Post Title Here'}
                                    </Link>
                                    <p className="blog-card-excerpt">
                                        {post.excerpt || post.content
                                            ? (post.excerpt || post.content).substring(0, 130) + '…'
                                            : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.'}
                                    </p>
                                    <div className="blog-card-footer">
                                        <span className="blog-card-date">
                                            {formatDate(post.publishedDate || post.createdAt)}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{
                                                fontFamily: "'Space Mono',monospace",
                                                fontSize: '.6rem', color: T.textDim,
                                                textTransform: 'uppercase', letterSpacing: '.08em',
                                            }}>
                                                💬 {post.commentsCount || post.comments || 0}
                                            </span>
                                            <Link to={`/blog/${post._id}`} className="blog-card-read-link">
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {/* Load more */}
                        {!loading && hasMore && (
                            <div className="blog-load-more">
                                <button
                                    className="blog-card-cta-ghost"
                                    onClick={() => setVisibleCount(c => c + 6)}
                                >
                                    Load More Posts ({posts.length - visibleCount} remaining)
                                </button>
                            </div>
                        )}
                    </main>

                    {/* ── SIDEBAR ── */}
                    <aside className="blog-sidebar">

                        {/* Search */}
                        <div className="blog-sb-card" style={{ '--sb-accent': T.red }}>
                            <div className="blog-sb-head">
                                <h3 className="blog-sb-title">Search</h3>
                            </div>
                            <div className="blog-sb-body">
                                <form className="blog-sb-search-form" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        className="blog-sb-search-input"
                                        placeholder="Search posts..."
                                        value={localSearchTerm}
                                        onChange={e => setLocalSearchTerm(e.target.value)}
                                        onKeyPress={e => e.key === 'Enter' && handleSearch(e)}
                                    />
                                    <button type="submit" className="blog-sb-search-btn">🔍</button>
                                </form>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="blog-sb-card" style={{ '--sb-accent': T.orange }}>
                            <div className="blog-sb-head">
                                <h3 className="blog-sb-title">Categories</h3>
                                {filters.categoryId && (
                                    <button className="blog-clear-chip" style={{ marginBottom: 0 }} onClick={clearFilters}>
                                        ✕ Clear
                                    </button>
                                )}
                            </div>
                            <div className="blog-sb-body" style={{ paddingTop: '.75rem', paddingBottom: '.5rem' }}>
                                {categoriesLoading ? (
                                    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                                        <div style={{
                                            width: 24, height: 24, margin: '0 auto',
                                            border: `2px solid ${T.border}`, borderTopColor: T.orange,
                                            borderRadius: '50%', animation: 'blogGrad 1s linear infinite',
                                        }} />
                                    </div>
                                ) : categories?.length > 0 ? (
                                    categories.map(cat => {
                                        const id = cat.id || cat._id;
                                        return (
                                            <Link
                                                key={id}
                                                to="/blog"
                                                className={`blog-sb-cat${filters.categoryId === id ? ' active' : ''}`}
                                                onClick={() => handleCategoryFilter(id)}
                                                style={{ '--sb-accent': T.orange }}
                                            >
                                                <span>{cat.name || cat.title}</span>
                                                <span className="blog-sb-cat-arrow">→</span>
                                            </Link>
                                        );
                                    })
                                ) : (
                                    <p style={{ fontFamily: "'Space Mono',monospace", fontSize: '.65rem', color: T.textDim, margin: 0 }}>
                                        No categories yet.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Posts */}
                        <div className="blog-sb-card" style={{ '--sb-accent': T.teal }}>
                            <div className="blog-sb-head">
                                <h3 className="blog-sb-title">Recent Posts</h3>
                            </div>
                            <div className="blog-sb-body">
                                {posts.slice(0, 4).map((post, i) => (
                                    <Link
                                        key={post._id || post.id || i}
                                        to={`/blog/${post._id || post.id}`}
                                        className="blog-recent-item"
                                    >
                                        <img
                                            src={post.thumbnail || post.images?.[0]?.url || `assets/images/gallery/0${(i % 4) + 1}.png`}
                                            alt={post.title || 'Post'}
                                            className="blog-recent-thumb"
                                        />
                                        <div className="blog-recent-info">
                                            <span className="blog-recent-title">
                                                {(post.title || 'Post title here').substring(0, 50)}
                                                {post.title?.length > 50 ? '…' : ''}
                                            </span>
                                            <span className="blog-recent-date">
                                                {formatDate(post.publishedDate || post.createdAt)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {loading && (
                                    <div className="blog-skeleton">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="blog-recent-item" style={{ cursor: 'default' }}>
                                                <div style={{ width: 58, height: 58, background: T.dark3, flexShrink: 0 }} />
                                                <div style={{ flex: 1 }}>
                                                    <div className="blog-skel-line" style={{ width: '80%' }} />
                                                    <div className="blog-skel-line" style={{ width: '50%', marginBottom: 0 }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Popular Tags */}
                        <div className="blog-sb-card" style={{ '--sb-accent': T.red }}>
                            <div className="blog-sb-head">
                                <h3 className="blog-sb-title">Popular Tags</h3>
                            </div>
                            <div className="blog-sb-body">
                                <div className="blog-tags-wrap">
                                    {POPULAR_TAGS.map(tag => (
                                        <button
                                            key={tag}
                                            className={`blog-tag${activeTag === tag ? ' active' : ''}`}
                                            onClick={() => {
                                                setActiveTag(activeTag === tag ? '' : tag);
                                                dispatch(setSearchTerm(activeTag === tag ? '' : tag));
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="blog-sb-card" style={{ '--sb-accent': T.orange }}>
                            <div className="blog-sb-head">
                                <h3 className="blog-sb-title">Stay Informed</h3>
                            </div>
                            <div className="blog-sb-body">
                                <p style={{
                                    fontFamily: "'Space Mono',monospace",
                                    fontSize: '.68rem', color: T.textMid, lineHeight: 1.65,
                                    marginBottom: '1rem',
                                }}>
                                    Get new posts, early deals, and deeply personal opinions about Spider-Man directly to your inbox.
                                </p>
                                <input
                                    type="email"
                                    className="blog-sb-newsletter-input"
                                    placeholder="your@email.com"
                                    value={newsletterEmail}
                                    onChange={e => setNewsletterEmail(e.target.value)}
                                />
                                <button className="blog-sb-newsletter-btn">
                                    Subscribe →
                                </button>
                            </div>
                        </div>

                    </aside>
                </div>

                {/* ── Animated bottom border ── */}
                <div className="blog-animated-border" />
            </div>
        </>
    );
};

export default Blog;