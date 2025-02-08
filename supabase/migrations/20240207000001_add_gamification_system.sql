-- Enable required extensions
create extension if not exists "moddatetime";

-- User Progress Table
create table user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  level integer default 1,
  xp integer default 0,
  next_level_xp integer default 1000,
  streak_days integer default 0,
  completed_tasks integer default 0,
  last_activity timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Skills Table
create table skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- User Skills Table
create table user_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  skill_id uuid references skills on delete cascade not null,
  level text not null,
  progress integer default 0,
  max_progress integer default 100,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, skill_id)
);

-- Achievements Table
create table achievements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  icon text not null,
  category text not null,
  xp_reward integer not null,
  requirements jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- User Achievements Table
create table user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  achievement_id uuid references achievements on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, achievement_id)
);

-- Learning Paths Table
create table learning_paths (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  category text not null,
  required_level integer default 1,
  required_skills jsonb,
  required_achievements jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Learning Steps Table
create table learning_steps (
  id uuid default uuid_generate_v4() primary key,
  path_id uuid references learning_paths on delete cascade not null,
  title text not null,
  description text not null,
  type text not null,
  duration text not null,
  xp_reward integer not null,
  order_index integer not null,
  prerequisites jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- User Learning Progress Table
create table user_learning_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  step_id uuid references learning_steps on delete cascade not null,
  status text not null default 'locked',
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, step_id)
);

-- Add RLS policies
alter table user_progress enable row level security;
alter table user_skills enable row level security;
alter table user_achievements enable row level security;
alter table user_learning_progress enable row level security;

-- RLS Policies
create policy "Users can view their own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can update their own progress"
  on user_progress for update
  using (auth.uid() = user_id);

-- Similar policies for other tables...

-- Triggers for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_user_progress_modtime
    before update on user_progress
    for each row
    execute function update_updated_at_column();

create trigger update_user_skills_modtime
    before update on user_skills
    for each row
    execute function update_updated_at_column();

create trigger update_user_learning_progress_modtime
    before update on user_learning_progress
    for each row
    execute function update_updated_at_column();

-- Create indexes
create index idx_user_progress_user_id on user_progress(user_id);
create index idx_user_skills_user_id on user_skills(user_id);
create index idx_user_achievements_user_id on user_achievements(user_id);
create index idx_user_learning_progress_user_id on user_learning_progress(user_id); 