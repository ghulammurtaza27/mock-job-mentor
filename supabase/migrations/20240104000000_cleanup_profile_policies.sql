-- First, disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Drop existing foreign key if it exists
ALTER TABLE profiles 
    DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Now modify the table structure
ALTER TABLE profiles 
    ALTER COLUMN id SET DATA TYPE uuid USING id::uuid,
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN name SET DATA TYPE text,
    ALTER COLUMN email SET DATA TYPE text,
    ALTER COLUMN avatar_url SET DATA TYPE text,
    ALTER COLUMN created_at SET DATA TYPE timestamp with time zone 
        USING COALESCE(created_at, timezone('utc'::text, now())),
    ALTER COLUMN updated_at SET DATA TYPE timestamp with time zone 
        USING COALESCE(updated_at, timezone('utc'::text, now()));

-- Set default values for timestamps
ALTER TABLE profiles 
    ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now()),
    ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());

-- Add back the foreign key constraint
ALTER TABLE profiles
    ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create the policies
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id); 