CREATE TABLE "contest_status" (
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"contest_id" integer,
	"profile_id" uuid,
	"status" text DEFAULT 'REJECTED',
	CONSTRAINT "contest_status_contest_id_profile_id_pk" PRIMARY KEY("contest_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "profile_activities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profile_activities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"contest_id" integer,
	"profile_id" uuid,
	"status" text DEFAULT 'REJECTED'
);
--> statement-breakpoint
ALTER TABLE "contest_status" ADD CONSTRAINT "contest_status_contest_id_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_status" ADD CONSTRAINT "contest_status_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_activities" ADD CONSTRAINT "profile_activities_contest_id_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_activities" ADD CONSTRAINT "profile_activities_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;