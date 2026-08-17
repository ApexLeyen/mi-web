// Root admin layout — no auth check here.
// The /admin/login page lives here (unprotected).
// Protected pages live in app/admin/(protected)/ and have their own layout.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
