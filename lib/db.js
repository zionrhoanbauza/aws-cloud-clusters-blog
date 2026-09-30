import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL);
let ready;
export function init() {
  return (ready ||= (async () => {
    await sql`create table if not exists users(id serial primary key, username text unique not null, pass text not null, bio text default '', created timestamptz default now())`;
    await sql`create table if not exists posts(id serial primary key, user_id int references users(id), title text not null, body text not null, image text, archived boolean default false, pinned boolean default false, is_private boolean default false, color text default 'lilac', created timestamptz default now())`;
    await sql`alter table users add column if not exists avatar text`;
  })());
}
