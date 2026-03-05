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
import { T } from "../components/styles";


const SectionLabel = ({ children }) => (
  <div style={{
    fontFamily: T.mono, fontSize: '9px', letterSpacing: '.22em',
    textTransform: 'uppercase', color: T.red, marginBottom: '10px',
  }}>
    {children}
  </div>
);

const RedBtn = ({ children, onClick, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    style={{
      padding: '12px 24px',
      background: T.red,
      border: 'none',
      color: '#fff',
      fontFamily: T.mono,
      fontSize: '11px',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      clipPath: 'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))',
      transition: 'background .15s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#a01212'}
    onMouseLeave={e => e.currentTarget.style.background = T.red}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: '11px 24px',
      background: 'none',
      border: `1px solid ${T.border}`,
      color: T.mid,
      fontFamily: T.mono,
      fontSize: '11px',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'border-color .15s, color .15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = T.red; e.currentTarget.style.color = T.white; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.mid; }}
  >
    {children}
  </button>
);

const Divider = () => (
  <div style={{ height: '1px', background: T.border, margin: '28px 0' }} />
);

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  background: T.dark3,
  border: `1px solid ${T.border}`,
  color: T.white,
  fontFamily: T.mono,
  fontSize: '12px',
  outline: 'none',
  transition: 'border-color .15s',
};

const labelStyle = {
  display: 'block',
  fontFamily: T.mono,
  fontSize: '9px',
  letterSpacing: '.16em',
  textTransform: 'uppercase',
  color: T.dim,
  marginBottom: '8px',
};

// ── Blog categories relevant to eFear ───────────────────────────────────────
const sidebarCategories = [
  { label: 'Comics & Manga',   value: 'comics'       },
  { label: 'Trading Cards',    value: 'trading-cards' },
  { label: 'Graphic Novels',   value: 'graphic-novels'},
  { label: 'Anime & Collectibles', value: 'anime'    },
  { label: 'New Arrivals',     value: 'new-arrivals'  },
  { label: 'News & Reviews',   value: 'news'          },
];

const popularTags = [
  'Marvel', 'DC Comics', 'Pokemon', 'Magic: The Gathering',
  'Manga', 'Anime', 'First Edition', 'Graded Cards',
  'Graphic Novels', 'Limited Print', 'Variant Cover', 'Signed',
];

const socialShare = [
  { label: 'Facebook',  icon: '𝒇', url: 'https://facebook.com'  },
  { label: 'Twitter',   icon: '𝕏', url: 'https://twitter.com'   },
  { label: 'LinkedIn',  icon: 'in', url: 'https://linkedin.com'  },
  { label: 'Instagram', icon: '◈',  url: 'https://instagram.com' },
];

// ── Main component ───────────────────────────────────────────────────────────

const BlogPost = () => {
  const dispatch   = useDispatch();
  const { id }     = useParams();
  const navigate   = useNavigate();

  const currentPost = useSelector(selectCurrentPost);
  const allPosts    = useSelector(selectAllPosts);
  const loading     = useSelector(selectLoading);
  const error       = useSelector(selectError);

  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [comment, setComment] = useState({ text: '', name: '', email: '', website: '' });
  const [focusedInput, setFocusedInput] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchPost({ id }));
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
    dispatch(/* your submit thunk */ console.log("Comment submitted:", comment));
    setComment({ text: '', name: '', email: '', website: '' });
  };

  const latestPosts = allPosts.slice(0, 6);
  const recentPosts = allPosts.slice(0, 4);

  const formatDate = (dateString) => {
    if (!dateString) return "November 5, 2021";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const getDateParts = (dateString) => {
    if (!dateString) return { day: '24', month: 'FEB' };
    const d = new Date(dateString);
    return {
      day:   d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    };
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading && !currentPost) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: T.bg,
        gap: '20px',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: `2px solid ${T.border}`,
          borderTopColor: T.red,
          borderRadius: '50%',
          animation: 'efear-spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes efear-spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontFamily: T.mono, fontSize: '10px', letterSpacing: '.18em', textTransform: 'uppercase', color: T.dim }}>
          Loading post...
        </span>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: T.bg,
      }}>
        <div style={{
          background: T.dark2, border: `1px solid ${T.red}`,
          padding: '28px 36px', maxWidth: '480px',
        }}>
          <SectionLabel>// error</SectionLabel>
          <div style={{ fontFamily: T.mono, fontSize: '12px', color: T.mid }}>{error}</div>
        </div>
      </div>
    );
  }

  const post = currentPost || {};

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: T.bg, minHeight: '100vh' }}>

      {/* ── Breadcrumb bar ── */}
      <div style={{
        background: T.dark2,
        borderBottom: `1px solid ${T.border}`,
        padding: '14px 0',
        display: 'none', // shown via CSS media query on md+
      }}
        className="d-none d-md-block"
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SectionLabel style={{ margin: 0 }}>// Blog</SectionLabel>
            <span style={{ color: T.border, fontFamily: T.mono, fontSize: '10px' }}>›</span>
            <span style={{ fontFamily: T.mono, fontSize: '10px', letterSpacing: '.1em', color: T.dim }}>
              Single Post
            </span>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="row g-4">

            {/* ════════════════════════════════════ MAIN COLUMN ══ */}
            <div className="col-12 col-lg-9">

              {/* ── Hero image ── */}
              <div style={{
                background: T.dark2,
                border: `1px solid ${T.border}`,
                overflow: 'hidden',
                marginBottom: '0',
              }}>
                <img
                  src={post.images?.[0]?.url || 'assets/images/posts/01.png'}
                  alt={post.title || 'Post image'}
                  style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '460px' }}
                />

                {/* ── Post meta bar ── */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '0',
                  borderTop: `1px solid ${T.border}`,
                }}>
                  {[
                    { icon: '👤', label: `By ${post.author || post.authorName || 'Admin'}` },
                    { icon: '💬', label: `${post.commentsCount || post.comments || 0} Comments` },
                    { icon: '📅', label: formatDate(post.publishedDate || post.createdAt) },
                  ].map((meta, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '12px 20px',
                      borderRight: `1px solid ${T.border}`,
                      fontFamily: T.mono, fontSize: '10px',
                      letterSpacing: '.08em', color: T.dim,
                      cursor: 'default',
                    }}>
                      <span style={{ fontSize: '12px' }}>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Post body ── */}
              <div style={{
                background: T.dark2,
                border: `1px solid ${T.border}`,
                borderTop: 'none',
                padding: '36px',
                marginBottom: '4px',
              }}>
                {/* Title */}
                <h1 style={{
                  fontFamily: T.anton, fontSize: 'clamp(26px, 4vw, 42px)',
                  color: T.white, letterSpacing: '.02em', lineHeight: 1.1,
                  marginBottom: '28px',
                }}>
                  {post.title || 'Post Title Here'}
                </h1>

                {/* Content */}
                {post.content && (
                  <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    style={{
                      fontFamily: T.mono, fontSize: '13px', lineHeight: '1.9',
                      color: T.mid,
                      // Scope rich-text styles
                    }}
                  />
                )}

                <style>{`
                  .efear-post-content h2,
                  .efear-post-content h3 {
                    font-family: ${T.anton};
                    color: ${T.white};
                    letter-spacing: .03em;
                    margin: 28px 0 12px;
                  }
                  .efear-post-content a { color: ${T.red}; text-decoration: none; }
                  .efear-post-content a:hover { text-decoration: underline; }
                  .efear-post-content blockquote {
                    border-left: 3px solid ${T.red};
                    padding: 12px 20px;
                    margin: 24px 0;
                    background: ${T.dark3};
                    color: ${T.mid};
                    font-style: italic;
                  }
                  .efear-post-content img { max-width: 100%; display: block; margin: 20px 0; }
                  .efear-post-content p { margin-bottom: 16px; }
                `}</style>

                <Divider />

                {/* Share bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: T.mono, fontSize: '9px', letterSpacing: '.18em',
                    textTransform: 'uppercase', color: T.dim,
                  }}>
                    Share This Post
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {socialShare.map(s => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={s.label}
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '34px', height: '34px',
                          background: T.dark3, border: `1px solid ${T.border}`,
                          color: T.dim, fontFamily: T.mono, fontSize: '11px',
                          textDecoration: 'none', transition: 'all .15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = T.red;
                          e.currentTarget.style.borderColor = T.red;
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = T.dark3;
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.color = T.dim;
                        }}
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Author bio ── */}
              {post.authorBio && (
                <div style={{
                  background: T.dark2,
                  border: `1px solid ${T.border}`,
                  borderTop: `3px solid ${T.red}`,
                  padding: '28px 36px',
                  display: 'flex', gap: '24px', alignItems: 'flex-start',
                  marginBottom: '4px',
                }}>
                  <img
                    src={post.authorAvatar || 'assets/images/avatars/avatar-1.png'}
                    alt={post.author || 'Author'}
                    style={{
                      width: '72px', height: '72px',
                      objectFit: 'cover',
                      border: `1px solid ${T.border}`,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <SectionLabel>// Author</SectionLabel>
                    <div style={{
                      fontFamily: T.anton, fontSize: '18px',
                      color: T.white, marginBottom: '8px',
                    }}>
                      {post.author || post.authorName || 'John Doe'}
                    </div>
                    <p style={{ fontFamily: T.mono, fontSize: '12px', color: T.mid, lineHeight: 1.8, margin: 0 }}>
                      {post.authorBio}
                    </p>
                  </div>
                </div>
              )}

              {/* ── Comment form ── */}
              <div style={{
                background: T.dark2,
                border: `1px solid ${T.border}`,
                borderTop: `3px solid ${T.red}`,
                padding: '36px',
                marginBottom: '4px',
              }}>
                <SectionLabel>// Leave a Reply</SectionLabel>
                <h2 style={{
                  fontFamily: T.anton, fontSize: '28px',
                  color: T.white, marginBottom: '6px',
                }}>
                  Post a Comment
                </h2>
                <p style={{ fontFamily: T.mono, fontSize: '10px', color: T.dim, marginBottom: '28px', letterSpacing: '.06em' }}>
                  Your email address will not be published. Required fields are marked *
                </p>

                <div style={{ marginBottom: '18px' }}>
                  <label style={labelStyle}>Comment *</label>
                  <textarea
                    rows={5}
                    value={comment.text}
                    onChange={e => handleCommentChange('text', e.target.value)}
                    onFocus={() => setFocusedInput('text')}
                    onBlur={() => setFocusedInput(null)}
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      borderColor: focusedInput === 'text' ? T.red : T.border,
                    }}
                  />
                </div>

                <div className="row g-3" style={{ marginBottom: '18px' }}>
                  {[
                    { field: 'name',    label: 'Name *',    type: 'text'    },
                    { field: 'email',   label: 'Email *',   type: 'email'   },
                    { field: 'website', label: 'Website',   type: 'text'    },
                  ].map(({ field, label, type }) => (
                    <div className="col-12 col-md-4" key={field}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        type={type}
                        value={comment[field]}
                        onChange={e => handleCommentChange(field, e.target.value)}
                        onFocus={() => setFocusedInput(field)}
                        onBlur={() => setFocusedInput(null)}
                        style={{
                          ...inputStyle,
                          borderColor: focusedInput === field ? T.red : T.border,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <RedBtn onClick={handleCommentSubmit}>Post Comment →</RedBtn>
              </div>

              {/* ── Latest Posts grid ── */}
              <div style={{
                background: T.dark2,
                border: `1px solid ${T.border}`,
                padding: '36px',
                marginTop: '4px',
              }}>
                <SectionLabel>// More Reading</SectionLabel>
                <h2 style={{
                  fontFamily: T.anton, fontSize: '28px',
                  color: T.white, marginBottom: '28px',
                }}>
                  Latest Posts
                </h2>

                <div className="row g-3">
                  {latestPosts.map((p, index) => {
                    const dateParts = getDateParts(p.publishedDate || p.createdAt);
                    return (
                      <div className="col-12 col-sm-6 col-lg-4" key={p.id || index}>
                        <div style={{
                          background: T.dark3,
                          border: `1px solid ${T.border}`,
                          overflow: 'hidden',
                          height: '100%',
                          transition: 'border-color .15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = T.red}
                          onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                        >
                          {/* Date badge + image */}
                          <div style={{ position: 'relative' }}>
                            <Link to={`/blog/${p._id}`}>
                              <img
                                src={p.images?.[0]?.url || `assets/images/blogs/0${(index % 6) + 1}.png`}
                                alt={p.title || 'Blog post'}
                                style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
                              />
                            </Link>
                            {/* Date badge */}
                            <div style={{
                              position: 'absolute', top: '12px', left: '12px',
                              background: T.red,
                              padding: '6px 10px',
                              textAlign: 'center',
                              clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
                            }}>
                              <div style={{ fontFamily: T.anton, fontSize: '18px', color: '#fff', lineHeight: 1 }}>
                                {dateParts.day}
                              </div>
                              <div style={{ fontFamily: T.mono, fontSize: '8px', letterSpacing: '.1em', color: 'rgba(255,255,255,.8)', textTransform: 'uppercase' }}>
                                {dateParts.month}
                              </div>
                            </div>
                          </div>

                          {/* Card body */}
                          <div style={{ padding: '18px' }}>
                            <Link
                              to={`/blog/${p._id}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <h5 style={{
                                fontFamily: T.anton, fontSize: '16px',
                                color: T.white, marginBottom: '10px',
                                lineHeight: 1.3, letterSpacing: '.02em',
                                transition: 'color .15s',
                              }}
                                onMouseEnter={e => e.currentTarget.style.color = T.red}
                                onMouseLeave={e => e.currentTarget.style.color = T.white}
                              >
                                {p.title || 'Blog Short Title'}
                              </h5>
                            </Link>
                            <p style={{
                              fontFamily: T.mono, fontSize: '10px',
                              color: T.dim, lineHeight: 1.7, margin: 0,
                            }}>
                              {(p.excerpt || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.').substring(0, 90)}...
                            </p>
                          </div>

                          {/* Card footer */}
                          <div style={{
                            padding: '10px 18px',
                            borderTop: `1px solid ${T.border}`,
                            fontFamily: T.mono, fontSize: '9px',
                            letterSpacing: '.1em', color: T.dim,
                            textTransform: 'uppercase',
                          }}>
                            💬 {p.commentsCount || p.comments || 0} Comments
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════ SIDEBAR ══════ */}
            <div className="col-12 col-lg-3">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>

                {/* ── Search ── */}
                <div style={{
                  background: T.dark2,
                  border: `1px solid ${T.border}`,
                  borderTop: `3px solid ${T.red}`,
                  padding: '24px',
                }}>
                  <SectionLabel>// Search</SectionLabel>
                  <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0' }}>
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={localSearchTerm}
                      onChange={e => setLocalSearchTerm(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
                      style={{
                        ...inputStyle,
                        flex: 1,
                        borderRight: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '0 16px',
                        background: T.red,
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '16px',
                        flexShrink: 0,
                        transition: 'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#a01212'}
                      onMouseLeave={e => e.currentTarget.style.background = T.red}
                    >
                      🔍
                    </button>
                  </form>
                </div>

                {/* ── Categories ── */}
                <div style={{
                  background: T.dark2,
                  border: `1px solid ${T.border}`,
                  borderTop: `3px solid ${T.red}`,
                  padding: '24px',
                }}>
                  <SectionLabel>// Browse</SectionLabel>
                  <h3 style={{
                    fontFamily: T.anton, fontSize: '20px',
                    color: T.white, marginBottom: '18px',
                  }}>
                    Categories
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {sidebarCategories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => handleCategoryFilter(cat.value)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: T.dark3,
                          border: `1px solid ${T.border}`,
                          borderLeft: `3px solid transparent`,
                          color: T.dim,
                          fontFamily: T.mono, fontSize: '11px',
                          letterSpacing: '.06em', textAlign: 'left',
                          cursor: 'pointer', transition: 'all .15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderLeftColor = T.red;
                          e.currentTarget.style.color = T.white;
                          e.currentTarget.style.background = '#1e1e1e';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderLeftColor = 'transparent';
                          e.currentTarget.style.color = T.dim;
                          e.currentTarget.style.background = T.dark3;
                        }}
                      >
                        {cat.label}
                        <span style={{ color: T.red, fontSize: '10px' }}>›</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Recent Posts ── */}
                <div style={{
                  background: T.dark2,
                  border: `1px solid ${T.border}`,
                  borderTop: `3px solid ${T.red}`,
                  padding: '24px',
                }}>
                  <SectionLabel>// Latest</SectionLabel>
                  <h3 style={{
                    fontFamily: T.anton, fontSize: '20px',
                    color: T.white, marginBottom: '18px',
                  }}>
                    Recent Posts
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {recentPosts.map((rp, index) => (
                      <React.Fragment key={rp.id || index}>
                        <Link
                          to={`/blog/${rp._id}`}
                          style={{
                            display: 'flex', gap: '12px', alignItems: 'flex-start',
                            textDecoration: 'none', padding: '12px 0',
                          }}
                        >
                          <img
                            src={rp.images?.[0]?.url || `assets/images/gallery/0${(index % 4) + 1}.png`}
                            alt={rp.title || 'Post'}
                            style={{
                              width: '64px', height: '64px',
                              objectFit: 'cover', flexShrink: 0,
                              border: `1px solid ${T.border}`,
                            }}
                          />
                          <div>
                            <div style={{
                              fontFamily: T.mono, fontSize: '11px',
                              color: T.mid, lineHeight: 1.5, marginBottom: '5px',
                              transition: 'color .15s',
                            }}
                              onMouseEnter={e => e.currentTarget.style.color = T.red}
                              onMouseLeave={e => e.currentTarget.style.color = T.mid}
                            >
                              {rp.title || 'Post title here'}
                            </div>
                            <div style={{
                              fontFamily: T.mono, fontSize: '9px',
                              letterSpacing: '.1em', color: T.dim,
                              textTransform: 'uppercase',
                            }}>
                              {formatDate(rp.publishedDate || rp.createdAt)}
                            </div>
                          </div>
                        </Link>
                        {index < recentPosts.length - 1 && (
                          <div style={{ height: '1px', background: T.border }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* ── Popular Tags ── */}
                <div style={{
                  background: T.dark2,
                  border: `1px solid ${T.border}`,
                  borderTop: `3px solid ${T.red}`,
                  padding: '24px',
                }}>
                  <SectionLabel>// Tags</SectionLabel>
                  <h3 style={{
                    fontFamily: T.anton, fontSize: '20px',
                    color: T.white, marginBottom: '18px',
                  }}>
                    Popular Tags
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {popularTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => dispatch(setSearchTerm(tag))}
                        style={{
                          padding: '6px 12px',
                          background: T.dark3,
                          border: `1px solid ${T.border}`,
                          color: T.dim,
                          fontFamily: T.mono, fontSize: '10px',
                          letterSpacing: '.08em',
                          cursor: 'pointer', transition: 'all .15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = T.red;
                          e.currentTarget.style.borderColor = T.red;
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = T.dark3;
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.color = T.dim;
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            {/* ══════════════════════════════════════════════════════ */}

          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;