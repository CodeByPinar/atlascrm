-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "ActivationCodeKind" AS ENUM ('DEMO', 'PAID');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "DemoActivationCode" ADD COLUMN IF NOT EXISTS "kind" "ActivationCodeKind" NOT NULL DEFAULT 'DEMO';

-- Backfill (safety)
UPDATE "DemoActivationCode" SET "kind" = 'DEMO' WHERE "kind" IS NULL;
