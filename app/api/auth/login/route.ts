import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // Simple hardcoded credentials (you can replace with DB later)
  if (username === 'Dariel' && password === '230501') {
    // Set a signed cookie (for demo purposes, plain value)
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
}
