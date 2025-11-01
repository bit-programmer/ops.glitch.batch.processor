import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgTable,
    text,
    timestamp,
    unique,
    varchar,
    uuid,
    smallint
} from "drizzle-orm/pg-core";

export const contactUs = pgTable("contactus", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    updatedAt: timestamp("updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    senderName: varchar("sender_name", { length: 256 }).notNull(),
    senderEmail: varchar("sender_email", { length: 256 }).notNull(),
    senderSubject: varchar("sender_subject", { length: 256 }).notNull(),
    senderMessage: text("sender_message").notNull(),
    isRead: boolean("is_read").default(false),
    isReplied: boolean("is_replied").default(false),
});

export const profile = pgTable("profiles", {
    id: uuid("id").primaryKey(),
    fullName: varchar("full_name", { length: 256 }),
    userName: varchar("username", { length: 256 }).unique(),
    email: varchar({ length: 256 }).unique(),
    avatarUrl: text("avatar_url"),
    bio: text(),
    tagLine: text("tag_line"),
    role: text(["Admin", "Student", "Professor"]).default("Student")
});

export const profileRelations = relations(profile, ({ one, many }) => ({
    profileMetrics: one(profileMetrics),
    contests: many(contests),
    breachProposal: many(breachProposal),
    testimonals: many(testimonals),
    submissions: many(submissions),
}));

export const profileMetrics = pgTable("profile_metrics", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    score: integer().default(0),
    rank: integer().default(-1),
    profileId: uuid("profile_id").references(() => profile.id).unique(),
});

export const profileMetricsRelations = relations(profileMetrics, ({ one }) => ({
    profile: one(profile, {
        fields: [profileMetrics.profileId],
        references: [profile.id],
    }),
}));

export const contests = pgTable("contests", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: text().notNull().unique(),
    title: varchar({ length: 256 }).notNull(),
    difficulty: text({ enum: ["EASY", "MEDIUM", "HARD"] }).notNull(),
    deadline: timestamp(),
    updatedAt: timestamp("updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    shortDesc: text("short_desc").notNull(),
    description: text().notNull(),
    requirements: text().notNull(),
    targetUrl: text("target_url").notNull(),
    reward: integer().default(100).notNull(),
    creatorId: uuid("creator_id").references(() => profile.id),
});

export const contestRelations = relations(contests, ({ one }) => ({
    creator: one(profile, {
        fields: [contests.creatorId],
        references: [profile.id],
    }),
}));

export const breachProposal = pgTable("breach_proposal", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 256 }).notNull(),
    updatedAt: timestamp("updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    proposalStatus: text("status", {
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
    })
        .default("PENDING")
        .notNull(),
    documentLink: text("document_link").notNull(),
    referenceURL: text("reference_url").notNull(),
    proposalLink: text("proposal_link").notNull(),
    profileId: uuid("profile_id").references(() => profile.id),
});

export const breachProposalRelations = relations(breachProposal, ({ one }) => ({
    profile: one(profile, {
        fields: [breachProposal.profileId],
        references: [profile.id],
    }),
}));

export const testimonals = pgTable("testimonals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    review: text("text"),
    socialId: text("social_id"),
    updatedAt: timestamp("updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    profileId: uuid("profile_id").references(() => profile.id),
    rating: smallint().default(5)
});

export const testimonalsRelations = relations(testimonals, ({ one }) => ({
    profile: one(profile, {
        fields: [testimonals.profileId],
        references: [profile.id],
    }),
}));

export const submissions = pgTable("submissions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    updatedAt: timestamp("updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    profileId: uuid("profile_id").references(() => profile.id),
    contestId: integer("contest_id").references(() => contests.id),
    status: text({ enum: ["ACCEPTED", "REJECTED", "PENDING"] })
        .default("PENDING")
        .notNull(),
    steps: text().notNull(),
    code: text().notNull(),
    preventionTechniques: text("prevention_techniques").notNull(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
    profile: one(profile, {
        fields: [submissions.profileId],
        references: [profile.id],
    }),
}));

export const contestCodes = pgTable(
    "contest_codes",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        updatedAt: timestamp("updated_at"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        deletedAt: timestamp("deleted_at"),
        contestId: integer("contest_id").references(() => contests.id),
        code: text(),
    },
    (t) => [
        unique().on(t.contestId, t.code),
        unique("contestid_code").on(t.contestId, t.code),
    ],
);
