-- Database: PostgreSQL (Neon). Tables are also auto-created by lib/db.js on 1st request.
create table if not exists users(id serial primary key, username text unique not null, pass text not null, bio text default '', avatar text, created timestamptz default now());
create table if not exists posts(id serial primary key, user_id int references users(id), title text not null, body text not null, image text, archived boolean default false, pinned boolean default false, is_private boolean default false, color text default 'lilac', created timestamptz default now());
create table if not exists pins(user_id int references users(id) on delete cascade, post_id int references posts(id) on delete cascade, primary key(user_id, post_id));
create table if not exists comments(id serial primary key, post_id int not null references posts(id) on delete cascade, user_id int not null references users(id) on delete cascade, body text not null, created timestamptz default now());
create index if not exists comments_post_idx on comments(post_id);
