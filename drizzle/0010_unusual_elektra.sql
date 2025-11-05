ALTER TABLE "contest_codes" ADD COLUMN "isActive" boolean;--> statement-breakpoint
ALTER TABLE "contest_status" ADD COLUMN "steps" text;--> statement-breakpoint
ALTER TABLE "contest_status" ADD COLUMN "improvements" text;--> statement-breakpoint
ALTER TABLE "contest_status" ADD COLUMN "uniqueCode" text;