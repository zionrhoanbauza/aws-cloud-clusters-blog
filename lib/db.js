import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL);
let ready;
export function init() {
  return (ready ||= sql.transaction([
    sql`create table if not exists users(id serial primary key, username text unique not null, pass text not null, bio text default '', created timestamptz default now())`,
    sql`create table if not exists posts(id serial primary key, user_id int references users(id), title text not null, body text not null, image text, archived boolean default false, pinned boolean default false, is_private boolean default false, color text default 'lilac', created timestamptz default now())`,
    sql`alter table users add column if not exists avatar text`,
    sql`create table if not exists pins(user_id int references users(id) on delete cascade, post_id int references posts(id) on delete cascade, primary key(user_id, post_id))`,
    sql`create table if not exists comments(id serial primary key, post_id int not null references posts(id) on delete cascade, user_id int not null references users(id) on delete cascade, body text not null, created timestamptz default now())`,
    sql`create index if not exists comments_post_idx on comments(post_id)`,
    sql`with m as (update posts set pinned=false where pinned returning user_id,id) insert into pins(user_id,post_id) select user_id,id from m on conflict do nothing`,
  ]));
}
