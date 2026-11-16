import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import ProjectForm from '../ProjectForm';

export const dynamic = 'force-dynamic';

async function updateProject(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  if (!id) throw new Error('Missing project id');

  await prisma.project.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      tags: formData.get('tags') as string,
      url: formData.get('url') as string,
      github: ((formData.get('github') as string) || '').trim(),
      color: formData.get('color') as string,
    },
  });

  revalidatePath('/admin/projects');
  revalidatePath('/');
  redirect('/admin/projects');
}

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Link
          href="/admin/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            marginBottom: '10px',
          }}
        >
          <ArrowLeft size={14} /> Volver a Proyectos
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.6rem' }}>✏️ Editar Proyecto: {project.title}</h2>
        <p style={{ margin: '6px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Actualiza los enlaces de descarga (Windows, Mac, Android o Web), descripción, imágenes y datos de este proyecto.
        </p>
      </div>

      <ProjectForm
        createAction={updateProject}
        initialData={{
          id: project.id,
          title: project.title ?? '',
          description: project.description ?? '',
          image: project.image ?? '🚀',
          tags: project.tags ?? '',
          url: project.url ?? '',
          github: project.github ?? '',
          color: project.color ?? '#7c3aed',
        }}
      />
    </div>
  );
}
