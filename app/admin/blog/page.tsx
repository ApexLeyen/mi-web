import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAdminAuth } from "@/lib/auth";
import BlogAdminClient from "./BlogAdminClient";

export const dynamic = 'force-dynamic';

async function createPost(formData: FormData) {
  "use server";
  await requireAdminAuth();
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

async function updatePost(formData: FormData) {
  "use server";
  await requireAdminAuth();
  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.post.update({
    where: { id },
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
  revalidatePath(`/blog/${id}`);
}

async function deletePost(formData: FormData) {
  "use server";
  await requireAdminAuth();
  await prisma.post.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
}

export default async function AdminBlog() {
  await requireAdminAuth();
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { comments: true } } }
    });
  } catch (e) {
    console.error("Error loading posts:", e);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2 style={{ margin: "0 0 8px 0", fontSize: "1.6rem" }}>✍️ Gestión del Blog</h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Redacta y edita artículos con formato enriquecido, imágenes de portada y vista previa en tiempo real.
        </p>
      </div>

      <BlogAdminClient
        posts={posts}
        createAction={createPost}
        updateAction={updatePost}
        deleteAction={deletePost}
      />
    </div>
  );
}
