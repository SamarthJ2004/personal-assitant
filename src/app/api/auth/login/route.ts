import { signToken } from '../../../../utils/jwt';
import { NextResponse } from 'next/server';

export async function POST(req : Request) {
  const { username, password } = await req.json();
  console.log(username, password);

  if (username === 'admin' && password === 'password') {
    const token = signToken({ username });
    
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: false,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}