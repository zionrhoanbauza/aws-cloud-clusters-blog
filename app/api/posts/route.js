import { sql, init } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { clean } from '@/lib/clean';
export async function GET(req) {
  await init(); const u = await getUser(); const p = new URL(req.url).searchParams;
  const mine = p.get('scope') === 'mine', arch = p.get('archived') === '1';
  const page = Math.max(1, +p.get('page') || 1), uid = u?.id ?? -1, off = (page - 1) * 10;
  if (mine && !u) return Response.json({ posts: [], pages: 1 });
  const posts = mine
    ? await sql`select p.id,p.user_id,p.title,p.body,(p.image is not null) as has_image,p.archived,p.is_private,p.color,p.created,u.username,
        exists(select 1 from pins x where x.post_id=p.id and x.user_id=${uid}) as is_pinned,(select count(*)::int from comments c where c.post_id=p.id) as ccount
        from posts p join users u on u.id=p.user_id where p.user_id=${uid} and p.archived=${arch} order by is_pinned desc,p.created desc limit 10 offset ${off}`
    : await sql`select p.id,p.user_id,p.title,p.body,(p.image is not null) as has_image,p.archived,p.is_private,p.color,p.created,u.username,
        exists(select 1 from pins x where x.post_id=p.id and x.user_id=${uid}) as is_pinned,(select count(*)::int from comments c where c.post_id=p.id) as ccount
        from posts p join users u on u.id=p.user_id where p.archived=false and (p.is_private=false or p.user_id=${uid}) order by is_pinned desc,p.created desc limit 10 offset ${off}`;
  const [{ n }] = mine
    ? await sql`select count(*)::int n from posts where user_id=${uid} and archived=${arch}`
    : await sql`select count(*)::int n from posts where archived=false and (is_private=false or user_id=${uid})`;
  return Response.json({ posts: posts.map(x => ({ ...x, body: clean(x.body) })), pages: Math.max(1, Math.ceil(n / 10)) });
}
export async function POST(req) {
  await init(); const u = await getUser(); if (!u) return Response.json({ error: 'Please log in first' }, { status: 401 });
  const { title, body, image, color, is_private } = await req.json();
  if (!title?.trim()) return Response.json({ error: 'Title is required' }, { status: 400 });
  if (image && image.length > 600000) return Response.json({ error: 'Image too large' }, { status: 413 });
  let b = clean(body); if (!b.replace(/<[^>]*>/g, '').trim() && !b.includes('<hr')) b = '';
  if (!b) return Response.json({ error: 'Description is required' }, { status: 400 });
  const [r] = await sql`insert into posts(user_id,title,body,image,color,is_private) values(${u.id},${title.trim().slice(0, 100)},${b},${image || null},${color || 'lilac'},${!!is_private}) returning id`;
  return Response.json({ id: r.id });
}
