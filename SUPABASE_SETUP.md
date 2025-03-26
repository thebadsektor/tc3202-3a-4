# Supabase Setup Instructions

## Setting Up User Profiles Table

To fix the user management functionality, you need to set up a profiles table in your Supabase project. Follow these steps:

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project (dnxidjqyrcxsxaoqkkif)
3. Go to the SQL Editor
4. Copy and paste the contents of the `supabase_setup.sql` file
5. Run the SQL commands
6. After setting up the profiles table, run the `create_missing_profiles.sql` script to create profile entries for existing users

## What This Does

The SQL script will:

1. Create a `profiles` table that links to Supabase Auth users
2. Set up a trigger to automatically create a profile when a user signs up
3. Configure Row Level Security policies to control access to the profiles

## Testing

After setting up the profiles table:

1. Create a test user through the Supabase Auth dashboard
2. Verify that a corresponding entry appears in the profiles table
3. Try accessing the Users tab in your application

## Troubleshooting

If you still encounter issues:

1. Check the browser console for specific error messages
2. Verify that your Supabase URL and anon key are correct in the `.env` file
3. Ensure that the RLS policies are properly configured to allow your application to access the profiles table
