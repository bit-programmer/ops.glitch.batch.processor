CREATE TABLE "profiles_to_contests" (
	"profile_id" uuid NOT NULL,
	"contest_id" integer NOT NULL,
	CONSTRAINT "profiles_to_contests_profile_id_contest_id_pk" PRIMARY KEY("profile_id","contest_id")
);
--> statement-breakpoint
ALTER TABLE "contests" DROP CONSTRAINT "contests_creator_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles_to_contests" ADD CONSTRAINT "profiles_to_contests_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles_to_contests" ADD CONSTRAINT "profiles_to_contests_contest_id_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" DROP COLUMN "creator_id";