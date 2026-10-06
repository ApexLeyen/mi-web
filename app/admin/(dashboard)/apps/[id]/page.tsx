import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import AppForm from '../AppForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Server action to update an existing app
async function updateApp(formData: FormData) {
  "use server";
  const id = formData.get('id') as string;
  if (!id) {
    throw new Error('Missing app id');
  }
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
  // Re‑validate the relevant paths so the UI updates immediately
  revalidatePath('/admin/apps');
  revalidatePath('/');
}

export default async function EditApp({ params }: { params: { id: string } }) {
  const app = await prisma.app.findUnique({ where: { id: params.id } });
  if (!app) {
    notFound();
  }
  // Convert the Prisma record into a FormData‑compatible shape for AppForm.
  // AppForm expects its fields via the native form submission, so we pass the app as defaults.
  const defaultValues = {
    name: app.name,
    icon: app.icon,
    description: app.description,
    category: app.category,
    version: app.version,
    size: app.size,
    minRequirements: app.minRequirements,
    changelog: app.changelog,
    downloadUrl: app.downloadUrl,
    status: app.status,
  };

  // Render the same AppForm but with hidden input for the id and pre‑filled values.
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>✏️ Editar Aplicación</h2>
      <AppForm
        createAction={updateApp}
        // Pass the existing values as default props – AppForm reads from the form itself, so we’ll embed hidden inputs.
        // We extend AppForm with an extra hidden field for the id.
        // To keep the component reusable we’ll render the hidden field here.
      />
      {/* Hidden field with the app id – placed outside AppForm because the component does not render it. */}
      <form style={{ display: 'none' }} action={updateApp}>
        <input type="hidden" name="id" value={app.id} />
      </form>
      {/* Initialise the form fields via JS – simple way without refactoring AppForm. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const form = document.querySelector('form[action="${updateApp.name}"]');
            if (form) {
              Object.entries(${JSON.stringify(defaultValues)}).forEach(([key, value]) => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) input.value = value;
              });
            }
          `,
        }}
      />
    </div>
  );
}
