import { sql, init } from '@/lib/db';
import { getUser } from '@/lib/auth';
export async function GET(_, { params }) {
  const { id } = await params; await init(); const u = await getUser();
  const [p] = await sql`select image,user_id,is_private,archived from posts where id=${+id}`;
  if (!p?.image || !(u?.id === p.user_id || (!p.is_private && !p.archived))) return new Response('Not found', { status: 404 });
  const m = /^data:(image\/[\w+.-]+);base64,(.+)$/.exec(p.image);
  if (!m) return new Response('Bad image', { status: 415 });
  return new Response(Buffer.from(m[2], 'base64'), { headers: { 'Content-Type': m[1], 'Cache-Control': 'private, max-age=86400' } });
}
