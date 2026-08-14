import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { comments: true } } }
  });

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Blog</span>
          <h1 className="section-title">
            Artículos & <span className="gradient-text">Tutoriales</span>
          </h1>
          <p>Comparto lo que aprendo: programación, IA, desarrollo móvil y las últimas tendencias tecnológicas.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {posts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No hay artículos publicados todavía. ¡Vuelve pronto!</p>
          ) : (
            posts.map(post => (
              <Link key={post.id} href={`/blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="glass" style={{ padding: '24px', borderRadius: '16px', cursor: 'pointer', transition: 'transform 0.2s', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {(post.emoji.startsWith("http") || post.emoji.startsWith("/") || post.emoji.startsWith("data:image")) ? (
                    <div style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                      <img src={post.emoji} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{post.emoji}</div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <span style={{ background: 'var(--accent-primary)', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem' }}>{post.tag}</span>
                    <span>⏱ {post.readTime}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post._count.comments}</span>
                  </div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{post.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{post.excerpt}</p>
                </article>
              </Link>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '60px' }}>
          <Link href="/" className="btn btn-outline">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
