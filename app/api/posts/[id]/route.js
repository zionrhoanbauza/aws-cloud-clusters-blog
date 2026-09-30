import { sql, init } from '@/lib/db';
import { getUser, isHead } from '@/lib/auth';
const J = (o, status = 200) => Response.json(o, { status });
export async function PATCH(req, { params }) {
  const { id } = await params; await init(); const u = await getUser(); const pid = +id;
  if (!u) return J({ error: 'Login required' }, 401);
  const b = await req.json();
  if (b.pinned !== undefined) {
    if (b.pinned) await sql`insert into pins(user_id,post_id) select ${u.id},p.id from posts p where p.id=${pid} and (p.is_private=false or p.user_id=${u.id}) on conflict do nothing`;
    else await sql`delete from pins where user_id=${u.id} and post_id=${pid}`;
  }
  if (b.archived !== undefined || b.is_private !== undefined || b.color !== undefined)
    await sql`update posts set archived=coalesce(${b.archived ?? null},archived), is_private=coalesce(${b.is_private ?? null},is_private), color=coalesce(${b.color ?? null},color) where id=${pid} and user_id=${u.id}`;
  return J({ ok: 1 });
}
export async function DELETE(req, { params }) {
  const { id } = await params; await init(); const u = await getUser();
  if (!u) return J({ error: 'Login required' }, 401);
  if (isHead(u)) await sql`delete from posts where id=${+id}`;
  else await sql`delete from posts where id=${+id} and user_id=${u.id}`;
  return J({ ok: 1 });
}
