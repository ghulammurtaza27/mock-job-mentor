create table github_integrations (
  id uuid references auth.users on delete cascade,
  github_username text not null,
  access_token text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create table project_deployments (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects on delete cascade,
  environment text not null,
  status text not null,
  deployed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  deployment_url text,
  logs text
);

-- Add RLS policies
alter table github_integrations enable row level security;
alter table project_deployments enable row level security;

create policy "Users can view their own github integrations"
  on github_integrations for select
  using (auth.uid() = id);

create policy "Users can manage their own github integrations"
  on github_integrations for all
  using (auth.uid() = id);

create policy "Users can view their project deployments"
  on project_deployments for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_deployments.project_id
      and projects.user_id = auth.uid()
    )
  ); 