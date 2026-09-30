import { sql, init } from '@/lib/db';
import { getUser, isHead } from '@/lib/auth';
const J = (o, status = 200) => Response.json(o, { status });
async function seen(pid, u) {
  const [p] = await sql`select user_id,is_private,archived from posts where id=${pid}`;
  return p && (u?.id === p.user_id || (!p.is_private && !p.archived)) ? p : null;
}
export async function GET(_, { params }) {
  const { id } = await params; await init(); const u = await getUser();
  if (!(await seen(+id, u))) return J({ error: 'Post not found' }, 404);
  const comments = await sql`select c.id,c.user_id,c.body,c.created,u.username from comments c join users u on u.id=c.user_id where c.post_id=${+id} order by c.created`;
  return J({ comments });
}
export async function POST(req, { params }) {
  const { id } = await params; await init(); const u = await getUser();
  if (!u) return J({ error: 'Please log in to comment' }, 401);
  if (!(await seen(+id, u))) return J({ error: 'Post not found' }, 404);
  const { body } = await req.json(); const t = String(body || '').trim().slice(0, 500);
  if (!t) return J({ error: 'Write something first' }, 400);
  await sql`insert into comments(post_id,user_id,body) values(${+id},${u.id},${t})`;
  return J({ ok: 1 });
}
// the comment's author, the post's owner, and the head account can delete a comment
export async function DELETE(req, { params }) {
  const { id } = await params; await init(); const u = await getUser();
  if (!u) return J({ error: 'Login required' }, 401);
  const cid = +new URL(req.url).searchParams.get('cid');
  const [p] = await sql`select user_id from posts where id=${+id}`;
  const [c] = await sql`select user_id from comments where id=${cid} and post_id=${+id}`;
  if (!p || !c) return J({ error: 'Not found' }, 404);
  if (!(u.id === c.user_id || u.id === p.user_id || isHead(u))) return J({ error: 'Not allowed' }, 403);
  await sql`delete from comments where id=${cid}`;
  return J({ ok: 1 });
}
