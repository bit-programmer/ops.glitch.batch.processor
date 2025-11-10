DROP TABLE "ops_score" CASCADE;--> statement-breakpoint
ALTER TABLE "profile_metrics" RENAME COLUMN "score" TO "ops_score";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;