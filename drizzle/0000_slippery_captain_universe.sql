CREATE TABLE "breach_proposal" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "breach_proposal_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(256) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"document_link" text NOT NULL,
	"reference_url" text NOT NULL,
	"proposal_link" text NOT NULL,
	"profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE "contactus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contactus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"sender_name" varchar(256) NOT NULL,
	"sender_email" varchar(256) NOT NULL,
	"sender_subject" varchar(256) NOT NULL,
	"sender_message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"is_replied" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "contest_codes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contest_codes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"contest_id" integer,
	"code" text,
	CONSTRAINT "contest_codes_contest_id_code_unique" UNIQUE("contest_id","code"),
	CONSTRAINT "contestid_code" UNIQUE("contest_id","code")
);
--> statement-breakpoint
CREATE TABLE "contests" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contests_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"title" varchar(256) NOT NULL,
	"difficulty" text NOT NULL,
	"deadline" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"short_desc" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text NOT NULL,
	"target_url" text NOT NULL,
	"reward" integer DEFAULT 100 NOT NULL,
	"creator_id" uuid,
	CONSTRAINT "contests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" varchar(256),
	"username" varchar(256),
	"email" varchar(256),
	"avatar_url" text,
	"bio" text,
	"tag_line" text,
	"role" text DEFAULT 'Student',
	CONSTRAINT "profiles_username_unique" UNIQUE("username"),
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "profile_metrics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profile_metrics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"score" integer DEFAULT 0,
	"rank" integer DEFAULT -1,
	"profile_id" uuid
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "submissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"profile_id" uuid,
	"contest_id" integer,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"steps" text NOT NULL,
	"code" text NOT NULL,
	"prevention_techniques" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "testimonals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"text" text,
	"social_id" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"profile_id" uuid
);
--> statement-breakpoint
ALTER TABLE "breach_proposal" ADD CONSTRAINT "breach_proposal_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_codes" ADD CONSTRAINT "contest_codes_contest_id_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_creator_id_profiles_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_metrics" ADD CONSTRAINT "profile_metrics_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_contest_id_contests_id_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonals" ADD CONSTRAINT "testimonals_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;