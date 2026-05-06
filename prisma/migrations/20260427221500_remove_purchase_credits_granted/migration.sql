-- Drop obsolete creditsGranted column from purchases
ALTER TABLE "purchases" DROP COLUMN IF EXISTS "creditsGranted";
