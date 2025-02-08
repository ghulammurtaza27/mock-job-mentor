-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING ( auth.uid() = id );

-- Add delete policy
CREATE POLICY "Users can delete own profile"
    ON profiles FOR DELETE
    USING ( auth.uid() = id );

-- Make sure foreign key constraint exists
ALTER TABLE profiles 
    DROP CONSTRAINT IF EXISTS profiles_id_fkey,
    ADD CONSTRAINT profiles_id_fkey 
    FOREIGN KEY (id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;

-- Make sure columns have correct nullability
ALTER TABLE profiles
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL DEFAULT timezone('utc'::text, now()),
    ALTER COLUMN updated_at SET NOT NULL DEFAULT timezone('utc'::text, now()); 