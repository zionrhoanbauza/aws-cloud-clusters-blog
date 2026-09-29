import { sql, init } from '@/lib/db';
import { getUser } from '@/lib/auth';
export async function PATCH(req, { params }) {
  const { id } = await params; await init(); const u = await getUser();
  if (!u) return Response.json({ error: 'Login required' }, { status: 401 });
  const b = await req.json();
  await sql`update posts set archived=coalesce(${b.archived ?? null},archived), pinned=coalesce(${b.pinned ?? null},pinned), is_private=coalesce(${b.is_private ?? null},is_private), color=coalesce(${b.color ?? null},color) where id=${+id} and user_id=${u.id}`;
  return Response.json({ ok: 1 });
}
export async function DELETE(req, { params }) {
  const { id } = await params; await init(); const u = await getUser();
  if (!u) return Response.json({ error: 'Login required' }, { status: 401 });
  await sql`delete from posts where id=${+id} and user_id=${u.id}`;
  return Response.json({ ok: 1 });
}
