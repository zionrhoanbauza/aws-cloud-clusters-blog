import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const key = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
export const HEAD = process.env.HEAD_USERNAME || 'zzy';
export const isHead = u => !!u && u.username === HEAD;
export async function setSession(u) {
  const t = await new SignJWT({ id: u.id, username: u.username }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(key);
  (await cookies()).set('s', t, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 604800 });
}
export async function getUser() {
  try { const t = (await cookies()).get('s')?.value; return t ? (await jwtVerify(t, key)).payload : null; } catch { return null; }
}
export async function clearSession() { (await cookies()).delete('s'); }
