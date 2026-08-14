"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch post and comments data
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          router.push('/blog'); // Redirect if not found
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/posts/${id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (id) {
      Promise.all([fetchPost(), fetchComments()]).then(() => setLoading(false));
    }
  }, [id, router]);

  const handleLike = async () => {
    if (!post) return;
    // Optimistic update
    setPost({ ...post, likes: post.likes + 1 });
    try {
      await fetch(`/api/posts/${id}/like`, { method: 'POST' });
    } catch (error) {
      console.error('Error liking post:', error);
      setPost({ ...post, likes: post.likes - 1 }); // Revert on error
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments([addedComment, ...comments]);
        setNewComment({ author: '', content: '' });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Cargando artículo...</p>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link href="/blog" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
          ← Volver al blog
        </Link>
        
        <article>
          <header style={{ marginBottom: '40px' }}>
            {(post.emoji.startsWith("http") || post.emoji.startsWith("/") || post.emoji.startsWith("data:image")) ? (
              <div style={{ width: '100%', height: '320px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                <img src={post.emoji} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>{post.emoji}</div>
            )}
            <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{post.title}</h1>
            <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '0.9rem', alignItems: 'center' }}>
              <span style={{ background: 'var(--accent-primary)', color: '#fff', padding: '4px 12px', borderRadius: '20px' }}>
                {post.tag}
              </span>
              <span>⏱ {post.readTime}</span>
              <span>📅 {new Date(post.createdAt).toLocaleDateString('es-ES')}</span>
            </div>
          </header>

          <div 
            style={{ 
              fontSize: '1.1rem', 
              lineHeight: 1.8, 
              color: 'var(--text-secondary)',
              marginBottom: '50px',
              whiteSpace: 'pre-wrap'
            }}
          >
            {post.content}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
            <button 
              onClick={handleLike}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border-glass)', 
                padding: '12px 30px', 
                borderRadius: '30px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
            >
              ❤️ Dar Like <span style={{ fontWeight: 'bold' }}>({post.likes})</span>
            </button>
          </div>
        </article>

        {/* Comments Section */}
        <section style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '40px', paddingBottom: '80px' }}>
          <h3 style={{ marginBottom: '20px' }}>Comentarios ({comments.length})</h3>
          
          <form onSubmit={handleCommentSubmit} style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', marginBottom: '40px' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Deja un comentario</h4>
            <input
              type="text"
              placeholder="Tu nombre"
              value={newComment.author}
              onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
              required
              style={inputStyle}
            />
            <textarea
              placeholder="¿Qué te pareció el artículo?"
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              required
              style={{ ...inputStyle, minHeight: '100px', marginTop: '12px' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSubmitting}
              style={{ marginTop: '12px', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Enviando...' : 'Publicar comentario'}
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {comments.map(comment => (
              <div key={comment.id} className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>{comment.author}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  outline: 'none'
};
