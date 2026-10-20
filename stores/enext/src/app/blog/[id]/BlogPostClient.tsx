'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  useGetBlogPostByIdQuery,
  useGetAllBlogPostsQuery,
  useIncrementBlogViewsMutation,
  useSubmitBlogCommentMutation,
  type BlogPost,
} from '@/lib/redux/api/blogApi';
import { T, postStyles, C, FONT_MONO, FONT_ANTON } from '@/components/styles';
import { SITE_URL } from '@/lib/utils/site';

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : '';
const getDateParts = (iso?: string) => {
  if (!iso) return null;
  const d = new Date(iso);
  return {
    day: String(d.getUTCDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
  };
};
const postId = (p: BlogPost) => p._id ?? p.id ?? '';
const commentCount = (p: BlogPost) => p.commentsCount ?? p.comments ?? 0;

const sidebarCategories = [
  { label: 'Comics & Manga', value: 'comics' },
  { label: 'Trading Cards', value: 'trading-cards' },
  { label: 'Graphic Novels', value: 'graphic-novels' },
  { label: 'Anime & Collectibles', value: 'anime' },
  { label: 'New Arrivals', value: 'new-arrivals' },
  { label: 'News & Reviews', value: 'news' },
];

const popularTags = [
  'Marvel', 'DC Comics', 'Pokemon', 'Magic: The Gathering', 'Manga', 'Anime',
  'First Edition', 'Graded Cards', 'Graphic Novels', 'Limited Print', 'Variant Cover', 'Signed',
];

/* ── Small presentational pieces (module scope — never declare inside a render body) ── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: C.red, marginBottom: 10 }}>
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: C.border, margin: '28px 0' }} />;

const panel: React.CSSProperties = { background: C.card, border: `1px solid ${C.border}` };
const redTopPanel: React.CSSProperties = { ...panel, borderTop: `3px solid ${C.red}` };

interface BlogPostClientProps {
  id: string;
  initialPost: BlogPost;
  initialPosts: BlogPost[];
}

export default function BlogPostClient({ id, initialPost, initialPosts }: BlogPostClientProps) {
  /* Server-rendered data is the fallback so the SEO HTML is complete on first paint;
   * RTK Query then revalidates in the background (and re-runs after a comment is posted,
   * because submitBlogComment invalidates the { Blog, id } tag). */
  const { data: fetchedPost, isError } = useGetBlogPostByIdQuery(id);
  const post = fetchedPost ?? initialPost;

  const { data: fetchedPosts } = useGetAllBlogPostsQuery({ sortBy: 'desc', limit: 7 });
  const allPosts = fetchedPosts ?? initialPosts;

  const [incrementViews] = useIncrementBlogViewsMutation();
  const [submitComment, { isLoading: submitting }] = useSubmitBlogCommentMutation();

  const [comment, setComment] = useState({ text: '', name: '', email: '', website: '' });
  const [commentStatus, setCommentStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Count one view per visit. The ref also stops React StrictMode's dev-only
  // double-invoked effect from counting twice.
  const viewedId = useRef<string | null>(null);


  const handleCommentChange = (field: keyof typeof comment, value: string) => {
    setComment((prev) => ({ ...prev, [field]: value }));
    if (commentStatus) setCommentStatus(null);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.text.trim() || !comment.name.trim() || !comment.email.trim()) {
      setCommentStatus({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(comment.email)) {
      setCommentStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    try {
      await submitComment({ postId: id, ...comment }).unwrap();
      setComment({ text: '', name: '', email: '', website: '' });
      setCommentStatus({ type: 'success', text: 'Thanks! Your comment was submitted.' });
    } catch {
      setCommentStatus({ type: 'error', text: 'Could not post your comment. Please try again.' });
    }
  };

  const otherPosts = allPosts.filter((p) => postId(p) !== id);
  const latestPosts = otherPosts.slice(0, 6);
  const recentPosts = otherPosts.slice(0, 4);

  const published = post.publishedDate || post.createdAt;
  const author = post.author || post.authorName || 'Admin';
  const postUrl = `${SITE_URL}/blog/${id}`;
  const shareLinks = [
    { label: 'Facebook', icon: '𝒇', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
    { label: 'X', icon: '𝕏', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}` },
    { label: 'LinkedIn', icon: 'in', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
  ];

    useEffect(() => {
        if (viewedId.current === id) return;
        viewedId.current = id;
        incrementViews(id);
    }, [id, incrementViews]);

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <style>{postStyles}</style>

      {/* ── Breadcrumb ── */}
      <nav
        aria-label="breadcrumb"
        className="d-none d-md-block"
        style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: '14px 0' }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '.1em' }}>
          <Link href="/" style={{ color: C.dim, textDecoration: 'none' }}>Home</Link>
          <span style={{ color: C.border }}>›</span>
          <Link href="/blog" style={{ color: C.red, textDecoration: 'none' }}>Blog</Link>
          <span style={{ color: C.border }}>›</span>
          <span style={{ color: C.dim }} aria-current="page">{post.title}</span>
        </div>
      </nav>

      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div className="row g-4">
            {/* ═════════ MAIN COLUMN ═════════ */}
            <div className="col-12 col-lg-9">
              <article>
                {isError && !fetchedPost && (
                  <div role="status" style={{ ...panel, borderColor: C.red, padding: '10px 16px', marginBottom: 4, fontFamily: FONT_MONO, fontSize: 11, color: C.mid }}>
                    Couldn&apos;t refresh this post — showing the saved version.
                  </div>
                )}

                <div style={{ ...panel, overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.images?.[0]?.url || '/assets/images/posts/01.png'}
                    alt={post.title}
                    width={1200}
                    height={460}
                    fetchPriority="high"
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', maxHeight: 460 }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', borderTop: `1px solid ${C.border}` }}>
                    {[
                      { icon: '👤', label: `By ${author}` },
                      { icon: '💬', label: `${commentCount(post)} Comments` },
                      ...(published ? [{ icon: '📅', label: formatDate(published), iso: published }] : []),
                    ].map((meta) => (
                      <div
                        key={meta.label}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRight: `1px solid ${C.border}`, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '.08em', color: C.dim }}
                      >
                        <span aria-hidden style={{ fontSize: 12 }}>{meta.icon}</span>
                        {'iso' in meta ? <time dateTime={meta.iso}>{meta.label}</time> : <span>{meta.label}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Post body */}
                <div style={{ ...panel, borderTop: 'none', padding: 36, marginBottom: 4 }}>
                  <h1 style={{ fontFamily: FONT_ANTON, fontSize: 'clamp(26px, 4vw, 42px)', color: C.white, letterSpacing: '.02em', lineHeight: 1.1, marginBottom: 28 }}>
                    {post.title}
                  </h1>

                  {/* NOTE: content is injected as raw HTML. If fear-admin lets anyone but you
                      author posts, sanitize server-side first (e.g. `sanitize-html`). */}
                  {post.content && (
                    <div className="efear-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                  )}

                  <Divider />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', color: C.dim }}>
                      Share This Post
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {shareLinks.map((s) => (
                        <a key={s.label} href={s.href} className="bp-share" target="_blank" rel="noopener noreferrer" title={`Share on ${s.label}`} aria-label={`Share on ${s.label}`}>
                          {s.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Author bio */}
                {post.authorBio && (
                  <div style={{ ...redTopPanel, padding: '28px 36px', display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 4 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.authorAvatar || '/assets/images/avatars/avatar-1.png'}
                      alt={author}
                      width={72}
                      height={72}
                      loading="lazy"
                      style={{ objectFit: 'cover', border: `1px solid ${C.border}`, flexShrink: 0 }}
                    />
                    <div>
                      <SectionLabel>{'// Author'}</SectionLabel>
                      <div style={{ fontFamily: FONT_ANTON, fontSize: 18, color: C.white, marginBottom: 8 }}>{author}</div>
                      <p style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.mid, lineHeight: 1.8, margin: 0 }}>{post.authorBio}</p>
                    </div>
                  </div>
                )}
              </article>

              {/* ── Comment form ── */}
              <div style={{ ...redTopPanel, padding: 36, marginBottom: 4 }}>
                <SectionLabel>{'// Leave a Reply'}</SectionLabel>
                <h2 style={{ fontFamily: FONT_ANTON, fontSize: 28, color: C.white, marginBottom: 6 }}>Post a Comment</h2>
                <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.dim, marginBottom: 28, letterSpacing: '.06em' }}>
                  Your email address will not be published. Required fields are marked *
                </p>

                <form onSubmit={handleCommentSubmit} noValidate>
                  <div style={{ marginBottom: 18 }}>
                    <label htmlFor="bp-comment" className="bp-label">Comment *</label>
                    <textarea
                      id="bp-comment"
                      rows={5}
                      className="bp-input"
                      style={{ resize: 'vertical' }}
                      value={comment.text}
                      onChange={(e) => handleCommentChange('text', e.target.value)}
                      disabled={submitting}
                    />
                  </div>

                  <div className="row g-3" style={{ marginBottom: 18 }}>
                    {([
                      { field: 'name', label: 'Name *', type: 'text', auto: 'name' },
                      { field: 'email', label: 'Email *', type: 'email', auto: 'email' },
                      { field: 'website', label: 'Website', type: 'url', auto: 'url' },
                    ] as const).map(({ field, label, type, auto }) => (
                      <div className="col-12 col-md-4" key={field}>
                        <label htmlFor={`bp-${field}`} className="bp-label">{label}</label>
                        <input
                          id={`bp-${field}`}
                          type={type}
                          autoComplete={auto}
                          className="bp-input"
                          value={comment[field]}
                          onChange={(e) => handleCommentChange(field, e.target.value)}
                          disabled={submitting}
                        />
                      </div>
                    ))}
                  </div>

                  {commentStatus && (
                    <div
                      role="status"
                      style={{
                        marginBottom: 18, padding: '10px 14px', fontFamily: FONT_MONO, fontSize: 11,
                        border: `1px solid ${commentStatus.type === 'error' ? C.red : T.teal}`,
                        color: commentStatus.type === 'error' ? C.red : T.teal,
                      }}
                    >
                      {commentStatus.text}
                    </div>
                  )}

                  <button type="submit" className="bp-red-btn" disabled={submitting}>
                    {submitting ? 'Posting…' : 'Post Comment →'}
                  </button>
                </form>
              </div>

              {/* ── More reading ── */}
              {latestPosts.length > 0 && (
                <div style={{ ...panel, padding: 36, marginTop: 4 }}>
                  <SectionLabel>{'// More Reading'}</SectionLabel>
                  <h2 style={{ fontFamily: FONT_ANTON, fontSize: 28, color: C.white, marginBottom: 28 }}>Latest Posts</h2>

                  <div className="row g-3">
                    {latestPosts.map((p, index) => {
                      const pid = postId(p);
                      const parts = getDateParts(p.publishedDate || p.createdAt);
                      return (
                        <div className="col-12 col-sm-6 col-lg-4" key={pid || index}>
                          <div className="bp-card">
                            <Link href={`/blog/${pid}`} style={{ textDecoration: 'none', display: 'block' }}>
                              <div style={{ position: 'relative' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={p.images?.[0]?.url || `/assets/images/blogs/0${(index % 6) + 1}.png`}
                                  alt={p.title}
                                  width={400}
                                  height={160}
                                  loading="lazy"
                                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                                />
                                {parts && (
                                  <div
                                    style={{
                                      position: 'absolute', top: 12, left: 12, background: C.red, padding: '6px 10px', textAlign: 'center',
                                      clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
                                    }}
                                  >
                                    <div style={{ fontFamily: FONT_ANTON, fontSize: 18, color: '#fff', lineHeight: 1 }}>{parts.day}</div>
                                    <div style={{ fontFamily: FONT_MONO, fontSize: 8, letterSpacing: '.1em', color: 'rgba(255,255,255,.8)' }}>{parts.month}</div>
                                  </div>
                                )}
                              </div>
                              <div style={{ padding: 18 }}>
                                <h3 className="bp-card-title">{p.title}</h3>
                                {p.excerpt && (
                                  <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.dim, lineHeight: 1.7, margin: 0 }}>
                                    {p.excerpt.length > 90 ? `${p.excerpt.slice(0, 90)}…` : p.excerpt}
                                  </p>
                                )}
                              </div>
                            </Link>
                            <div style={{ padding: '10px 18px', borderTop: `1px solid ${C.border}`, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '.1em', color: C.dim, textTransform: 'uppercase' }}>
                              💬 {commentCount(p)} Comments
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ═════════ SIDEBAR ═════════ */}
            <aside className="col-12 col-lg-3" aria-label="Blog sidebar">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Search — GET to /blog?search= (BlogClient must read the param; see notes) */}
                <div style={{ ...redTopPanel, padding: 24 }}>
                  <SectionLabel>{'// Search'}</SectionLabel>
                  <form action="/blog" method="get" role="search" style={{ display: 'flex' }}>
                    <input
                      type="search"
                      name="search"
                      aria-label="Search posts"
                      placeholder="Search posts..."
                      className="bp-input"
                      style={{ flex: 1, borderRight: 'none' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bp-red-btn" aria-label="Search" style={{ padding: '0 16px', clipPath: 'none' }}>🔍</button>
                  </form>
                </div>

                <div style={{ ...redTopPanel, padding: 24 }}>
                  <SectionLabel>{'// Browse'}</SectionLabel>
                  <h2 style={{ fontFamily: FONT_ANTON, fontSize: 20, color: C.white, marginBottom: 18 }}>Categories</h2>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sidebarCategories.map((cat) => (
                      <Link key={cat.value} href={`/blog?category=${encodeURIComponent(cat.value)}`} className="bp-cat">
                        {cat.label}
                        <span style={{ color: C.red, fontSize: 10 }}>›</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {recentPosts.length > 0 && (
                  <div style={{ ...redTopPanel, padding: 24 }}>
                    <SectionLabel>{'// Latest'}</SectionLabel>
                    <h2 style={{ fontFamily: FONT_ANTON, fontSize: 20, color: C.white, marginBottom: 18 }}>Recent Posts</h2>
                    {recentPosts.map((rp, index) => (
                      <div key={postId(rp) || index} className="bp-recent">
                        <Link href={`/blog/${postId(rp)}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textDecoration: 'none', padding: '12px 0' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rp.images?.[0]?.url || `/assets/images/gallery/0${(index % 4) + 1}.png`}
                            alt={rp.title}
                            width={64}
                            height={64}
                            loading="lazy"
                            style={{ objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }}
                          />
                          <div>
                            <div className="bp-recent-title">{rp.title}</div>
                            <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '.1em', color: C.dim, textTransform: 'uppercase' }}>
                              {formatDate(rp.publishedDate || rp.createdAt)}
                            </div>
                          </div>
                        </Link>
                        {index < recentPosts.length - 1 && <div style={{ height: 1, background: C.border }} />}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ ...redTopPanel, padding: 24 }}>
                  <SectionLabel>{'// Tags'}</SectionLabel>
                  <h2 style={{ fontFamily: FONT_ANTON, fontSize: 20, color: C.white, marginBottom: 18 }}>Popular Tags</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {popularTags.map((tag) => (
                      <Link key={tag} href={`/blog?search=${encodeURIComponent(tag)}`} className="bp-tag">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
