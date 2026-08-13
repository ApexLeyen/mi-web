import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function createPost(formData: FormData) {
  "use server";
  await prisma.post.create({
    data: {
      title: formData.get("title") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as string,
      emoji: formData.get("emoji") as string,
      readTime: formData.get("readTime") as string,
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
}

async function deletePost(formData: FormData) {
  "use server";
  await prisma.post.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
}

export default async function AdminBlog() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { comments: true } } }
  });

  return (
    <div>
      <h2>Gestionar Blog</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', marginTop: '20px' }}>
        {/* Lista */}
        <div>
          <h3>Artículos Publicados ({posts.length})</h3>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {posts.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No hay artículos todavía.</p>
            ) : (
              posts.map(post => (
                <div key={post.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '2rem' }}>{post.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0 }}>{post.title}</h4>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {post.tag} • ❤️ {post.likes} • 💬 {post._count.comments} • {post.readTime}
                    </p>
                  </div>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Eliminar</button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Formulario */}
        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px' }}>
          <h3>Nuevo Artículo</h3>
          <form action={createPost} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <input type="text" name="title" placeholder="Título del artículo" required style={inputStyle} />
            <input type="text" name="emoji" placeholder="Emoji (ej. ⚡)" required style={inputStyle} />
            <input type="text" name="tag" placeholder="Tag (ej. Next.js, IA)" required style={inputStyle} />
            <input type="text" name="readTime" placeholder="Tiempo lectura (ej. 8 min)" required style={inputStyle} />
            <textarea name="excerpt" placeholder="Extracto breve (se muestra en la tarjeta)" required style={{...inputStyle, minHeight: '60px'}} />
            <textarea name="content" placeholder="Contenido completo del artículo..." required style={{...inputStyle, minHeight: '150px'}} />
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Publicar Artículo</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid var(--border-color)',
  background: 'var(--bg-card)',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  outline: 'none'
};
