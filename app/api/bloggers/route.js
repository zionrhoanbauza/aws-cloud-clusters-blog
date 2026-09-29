import { sql, init } from '@/lib/db';
export async function GET() {
  await init();
  const bloggers = await sql`select username,bio,created,(select count(*)::int from posts where user_id=users.id and archived=false and is_private=false) n from users order by n desc, created`;
  return Response.json({ bloggers });
}
