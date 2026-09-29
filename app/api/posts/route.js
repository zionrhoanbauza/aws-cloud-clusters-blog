import { sql, init } from '@/lib/db';
import { getUser } from '@/lib/auth';
export async function GET(req) {
  await init(); const u = await getUser(); const p = new URL(req.url).searchParams;
  const mine = p.get('scope') === 'mine', arch = p.get('archived') === '1';
  const page = Math.max(1, +p.get('page') || 1), uid = u?.id ?? -1, off = (page - 1) * 10;
  if (mine && !u) return Response.json({ posts: [], pages: 1 });
  const posts = mine
    ? await sql`select p.*,u.username from posts p join users u on u.id=p.user_id where p.user_id=${uid} and p.archived=${arch} order by p.pinned desc,p.created desc limit 10 offset ${off}`
    : await sql`select p.*,u.username from posts p join users u on u.id=p.user_id where p.archived=false and (p.is_private=false or p.user_id=${uid}) order by p.pinned desc,p.created desc limit 10 offset ${off}`;
  const [{ n }] = mine
    ? await sql`select count(*)::int n from posts where user_id=${uid} and archived=${arch}`
    : await sql`select count(*)::int n from posts where archived=false and (is_private=false or user_id=${uid})`;
  return Response.json({ posts, pages: Math.max(1, Math.ceil(n / 10)) });
}
export async function POST(req) {
  await init(); const u = await getUser(); if (!u) return Response.json({ error: 'Please log in first' }, { status: 401 });
  const { title, body, image, color, is_private } = await req.json();
  if (!title?.trim() || !body?.trim()) return Response.json({ error: 'Title and description are required' }, { status: 400 });
  if (image && image.length > 600000) return Response.json({ error: 'Image too large' }, { status: 413 });
  const [r] = await sql`insert into posts(user_id,title,body,image,color,is_private) values(${u.id},${title.trim().slice(0, 100)},${body.slice(0, 5000)},${image || null},${color || 'lilac'},${!!is_private}) returning id`;
  return Response.json({ id: r.id });
}
