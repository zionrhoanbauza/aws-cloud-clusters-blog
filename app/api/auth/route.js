import bcrypt from 'bcryptjs';
import { sql, init } from '@/lib/db';
import { setSession, getUser, clearSession } from '@/lib/auth';
const J = (o, status = 200) => Response.json(o, { status });
export async function GET() {
  await init(); const u = await getUser(); if (!u) return J({ user: null });
  const [r] = await sql`select id,username,bio,created from users where id=${u.id}`;
  return J({ user: r || null });
}
export async function POST(req) {
  await init(); const { action, username, password, bio } = await req.json();
  if (action === 'logout') { await clearSession(); return J({ ok: 1 }); }
  if (action === 'bio') {
    const u = await getUser(); if (!u) return J({ error: 'Login required' }, 401);
    await sql`update users set bio=${String(bio || '').slice(0, 300)} where id=${u.id}`; return J({ ok: 1 });
  }
  if (!/^\w{3,20}$/.test(username || '') || (password || '').length < 6) return J({ error: 'Username: 3-20 letters/numbers. Password: 6+ characters.' }, 400);
  if (action === 'register') {
    try {
      const [r] = await sql`insert into users(username,pass) values(${username},${await bcrypt.hash(password, 10)}) returning id,username`;
      await setSession(r); return J({ ok: 1 });
    } catch { return J({ error: 'Username already taken' }, 409); }
  }
  const [r] = await sql`select * from users where username=${username}`;
  if (!r || !(await bcrypt.compare(password, r.pass))) return J({ error: 'Wrong username or password' }, 401);
  await setSession(r); return J({ ok: 1 });
}
