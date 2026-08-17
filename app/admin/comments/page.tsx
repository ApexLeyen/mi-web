import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

async function deleteComment(formData: FormData) {
  "use server";
  await requireAdminAuth();
  await prisma.comment.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/comments");
}

export default async function AdminComments() {
  await requireAdminAuth();
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { post: { select: { title: true } } }
  });

  return (
    <div>
      <h2>Moderar Comentarios</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Revisa y elimina comentarios inapropiados de los artículos del blog.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay comentarios todavía.</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--accent-primary)' }}>{comment.author}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    en &quot;{comment.post.title}&quot;
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {comment.createdAt.toLocaleDateString('es-ES')}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{comment.content}</p>
              </div>
              <form action={deleteComment}>
                <input type="hidden" name="id" value={comment.id} />
                <button type="submit" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Eliminar</button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
