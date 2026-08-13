import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import AppsStore from "@/components/AppsStore/AppsStore";
import Portfolio from "@/components/Portfolio/Portfolio";
import Blog from "@/components/Blog/Blog";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let dbApps: any[] = [];
  let projects: any[] = [];
  let posts: any[] = [];

  try {
    dbApps = await prisma.app.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error("Error fetching apps:", err);
  }

  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error("Error fetching projects:", err);
  }

  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
  }

  const apps = dbApps.map(app => ({
    ...app,
    updatedAt: app.updatedAt ? app.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    rating: app.rating ?? undefined,
    status: app.status as "available" | "beta" | "soon",
    screenshots: []
  }));

  return (
    <>
      <a href="/admin/login" className="btn btn-primary" style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        zIndex: 1000,
      }}>Admin</a>
      <Hero />
      <About />
      <AppsStore initialApps={apps} />
      <Portfolio initialProjects={projects} />
      <Blog initialPosts={posts} />
    </>
  );
}
