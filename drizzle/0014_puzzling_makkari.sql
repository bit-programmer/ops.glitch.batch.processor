ALTER TABLE "profile_activities" RENAME COLUMN "uniqueCode" TO "unique_code";--> statement-breakpoint
ALTER TABLE "contest_status" DROP COLUMN "steps";--> statement-breakpoint
ALTER TABLE "contest_status" DROP COLUMN "improvements";--> statement-breakpoint
ALTER TABLE "contest_status" DROP COLUMN "uniqueCode";