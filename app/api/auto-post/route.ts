import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  // Verificar la clave secreta en el header Authorization
  const authHeader = request.headers.get('authorization');
  const secret = process.env.AUTO_POST_SECRET;

  if (!secret || !authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, tag, readTime, emoji } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Faltan campos requeridos: title y content' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title: String(title),
        excerpt: String(excerpt || ''),
        content: String(content),
        tag: String(tag || 'Tecnología'),
        emoji: String(emoji || '🤖'),
        readTime: String(readTime || '5 min de lectura'),
        likes: 0,
      },
    });

    return NextResponse.json({ success: true, postId: post.id }, { status: 201 });
  } catch (error) {
    console.error('Auto-post error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
