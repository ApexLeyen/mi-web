import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import AppForm from '../AppForm';

export const dynamic = 'force-dynamic';

// Server action to update an existing app
async function updateApp(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  if (!id) throw new Error('Missing app id');

  await prisma.app.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      version: formData.get('version') as string,
      size: formData.get('size') as string,
      minRequirements: formData.get('minRequirements') as string,
      changelog: formData.get('changelog') as string,
      downloadUrl: formData.get('downloadUrl') as string,
      status: formData.get('status') as string,
    },
  });

  revalidatePath('/admin/apps');
  revalidatePath('/');
  redirect('/admin/apps');
}

export default async function EditApp({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await prisma.app.findUnique({ where: { id } });
  if (!app) notFound();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <Link
          href="/admin/apps"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '10px' }}
        >
          <ArrowLeft size={14} /> Volver a Aplicaciones
        </Link>
        <h2 style={{ margin: 0, fontSize: '1.6rem' }}>✏️ Editar: {app.name}</h2>
      </div>

      <AppForm
        createAction={updateApp}
        initialData={{
          id: app.id,
          name: app.name ?? '',
          icon: app.icon ?? '',
          description: app.description ?? '',
          category: app.category ?? '',
          version: app.version ?? '',
          size: app.size ?? '',
          minRequirements: app.minRequirements ?? '',
          changelog: app.changelog ?? '',
          downloadUrl: app.downloadUrl ?? '',
          status: app.status ?? 'available',
        }}
      />
    </div>
  );
}
