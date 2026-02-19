import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  selectPosts,
  selectLoading,
  selectError,
} from '../../features/blog/slice';

const VISIBLE_ITEMS = 3;
const AUTO_PLAY_INTERVAL = 4000;

function LatestNews() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const totalSlides = Math.max(0, posts.length - VISIBLE_ITEMS + 1);

  const goTo = useCallback(
    (index) => {
      if (isTransitioning || posts.length === 0) return;
      const clamped = Math.max(0, Math.min(index, totalSlides - 1));
      setIsTransitioning(true);
      setCurrentIndex(clamped);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning, posts.length, totalSlides]
  );

  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  // Auto-play
  useEffect(() => {
    if (posts.length <= VISIBLE_ITEMS) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1));
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(autoPlayRef.current);
  }, [posts.length, totalSlides]);

  const pauseAutoPlay = () => clearInterval(autoPlayRef.current);

  const formatDate = (dateString) => {
    if (!dateString) return { day: '—', month: '—' };
    const d = new Date(dateString);
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
    };
  };

  const visiblePosts = posts.slice(currentIndex, currentIndex + VISIBLE_ITEMS);

  return (
    <section className="py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center">
          <h5 className="text-uppercase mb-0">Latest News</h5>
          <a href="blog.html" className="btn btn-light ms-auto rounded-0">
            View All News <i className="bx bx-chevron-right" />
          </a>
        </div>
        <hr />

        {/* States */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger rounded-0" role="alert">
            Failed to load news. Please try again later.
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-muted text-center py-4">No news articles available.</p>
        )}

        {/* Carousel */}
        {!loading && !error && posts.length > 0 && (
          <div
            className="latest-news-carousel position-relative"
            onMouseEnter={pauseAutoPlay}
          >
            {/* Cards track */}
            <div
              className="row g-3"
              style={{
                transition: 'opacity 0.4s ease',
                opacity: isTransitioning ? 0.4 : 1,
              }}
            >
              {visiblePosts.map((post) => {
                const { day, month } = formatDate(post.createdAt || post.publishedAt);
                return (
                  <div key={post.id} className="col-12 col-md-4">
                    <div className="card rounded-0 product-card border h-100">
                      {/* Date badge */}
                      <div className="news-date">
                        <div className="date-number">{day}</div>
                        <div className="date-month">{month}</div>
                      </div>

                      <a href={`/blog/${post.slug || post.id}`}>
                        <img
                          src={post.images ? post.images[0].url : `assets/images/posts/0${currentIndex + 1}.png`}
                          className="blog-img-top border-bottom bg-dark-1"
                          alt={post.title || 'News image'}
                          style={{ objectFit: 'cover', height: '200px' }}
                        />
                      </a>

                      <div className="card-body">
                        <div className="news-title">
                          <a href={`/blog/${post.slug || post.id}`}>
                            <h5 className="mb-3 text-capitalize">
                              {post.title || 'Untitled'}
                            </h5>
                          </a>
                        </div>
                        <p className="news-content mb-0">
                          {post.excerpt ||
                            (post.content
                              ? post.content.substring(0, 120) + '...'
                              : 'No preview available.')}
                        </p>
                      </div>

                      <div className="card-footer border-top">
                        <a href={`/blog/${post.slug || post.id}`}>
                          <p className="mb-0">
                            <small className="text-white">
                              {post.commentsCount ?? 0} Comments
                            </small>
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation — only rendered when there are more slides than fit */}
            {posts.length > VISIBLE_ITEMS && (
              <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                {/* Prev */}
                <button
                  className="btn btn-light rounded-0 px-3"
                  onClick={prev}
                  disabled={currentIndex === 0}
                  aria-label="Previous"
                >
                  <i className="bx bx-chevron-left" />
                </button>

                {/* Dots */}
                <div className="d-flex gap-2">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        background: i === currentIndex ? '#333' : '#ccc',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>

                {/* Next */}
                <button
                  className="btn btn-light rounded-0 px-3"
                  onClick={next}
                  disabled={currentIndex >= totalSlides - 1}
                  aria-label="Next"
                >
                  <i className="bx bx-chevron-right" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestNews;