import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { author, content } = body;

  if (!author || !content) {
    return NextResponse.json({ error: 'Nombre y comentario son requeridos' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      author,
      content,
      postId: id,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
