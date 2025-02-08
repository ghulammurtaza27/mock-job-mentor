-- Update existing columns and add new ones
DO $$ 
BEGIN
    -- Rename full_name to name if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'profiles' AND column_name = 'full_name') THEN
        ALTER TABLE profiles RENAME COLUMN full_name TO name;
    END IF;

    -- Add email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE profiles ADD COLUMN email text;
    END IF;

    -- Add avatar_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE profiles ADD COLUMN avatar_url text;
    END IF;

    -- Make created_at NOT NULL with default if it's nullable
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'profiles' AND column_name = 'created_at' AND is_nullable = 'YES') THEN
        ALTER TABLE profiles ALTER COLUMN created_at SET NOT NULL;
        ALTER TABLE profiles ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());
    END IF;

    -- Make updated_at NOT NULL with default if it's nullable
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'profiles' AND column_name = 'updated_at' AND is_nullable = 'YES') THEN
        ALTER TABLE profiles ALTER COLUMN updated_at SET NOT NULL;
        ALTER TABLE profiles ALTER COLUMN updated_at SET DEFAULT timezone('utc'::text, now());
    END IF;

    -- Drop unused columns if they exist
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE profiles DROP COLUMN username;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles DROP COLUMN role;
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING ( true );

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING ( auth.uid() = id );

-- Create or replace the updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Update existing profiles to have email if missing
UPDATE profiles 
SET email = auth.users.email
FROM auth.users
WHERE profiles.id = auth.users.id 
AND profiles.email IS NULL; 