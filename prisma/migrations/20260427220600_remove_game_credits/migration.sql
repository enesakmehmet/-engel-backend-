-- Drop obsolete gameCredits column from users
ALTER TABLE "users" DROP COLUMN IF EXISTS "gameCredits";
