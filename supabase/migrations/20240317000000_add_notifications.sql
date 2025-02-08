create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    type text not null,
    title text not null,
    message text not null,
    link text,
    read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    metadata jsonb,
    
    constraint notifications_type_check check (
        type in ('ticket_assigned', 'pr_review', 'pr_approved', 'pr_changes', 'mention', 'system')
    )
);

-- Add RLS policies
alter table public.notifications enable row level security;

create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "System can insert notifications"
  on public.notifications for insert
  with check (true);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_created_at_idx on public.notifications(created_at); 