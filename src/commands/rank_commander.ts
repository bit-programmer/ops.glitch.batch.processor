import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../core/db/index.ts";
import { contests, contestStatus, profile, profileMetrics } from "../core/db/schema.ts";
import { type Command } from "../fx/command.ts";

type RankType = {
    totalXPAchieved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    currentTimeExecution: number;
}

const defaultRank: RankType = { totalXPAchieved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, currentTimeExecution: 0 };

const weightsOfFactorInRank = {
    totalXPAchieved: 0.5,
    easySolved: 0.1,
    mediumSolved: 0.2,
    hardSolved: 0.7,
    currentTimeExecution: 0.5
};

const calculateOpsScore = (rank: RankType): number => {
  return (
    rank.totalXPAchieved * weightsOfFactorInRank.totalXPAchieved +
    rank.easySolved * weightsOfFactorInRank.easySolved +
    rank.mediumSolved * weightsOfFactorInRank.mediumSolved +
    rank.hardSolved * weightsOfFactorInRank.hardSolved +
    rank.currentTimeExecution * weightsOfFactorInRank.currentTimeExecution
  );
};

class RankCommander implements Command {

    private LIMIT = 10;

    public async execute(): Promise<void> {
        let chunkNumber = 0;
        while(true) {
            const userChunk = await db.select().from(profile).orderBy(asc(profile.createdAt)).limit(this.LIMIT).offset(chunkNumber * this.LIMIT);
            if(userChunk.length === 0) {
                console.log("Processing completed");
                break;
            }
            console.log(`Processing Chunk Number : ${chunkNumber}`);
            chunkNumber += 1;

            const userList = userChunk.map(row => row.id);
            const contestChunk = await db.select().from(contestStatus).where(and(inArray(contestStatus.profileId, userList), eq(contestStatus.status, "ACCEPTED"))).leftJoin(contests, eq(contests.id, contestStatus.contestId));

            const rankMap: Map<string, RankType> = new Map();

            contestChunk.forEach(contestRow => {

                const profileId = contestRow.contest_status.profileId || "";

                if(!rankMap.has(profileId)) {
                    rankMap.set(profileId, defaultRank);
                }

                const existing = rankMap.get(profileId)!;

                const isEasy = (contestRow.contests?.difficulty === "EASY") ? 1 : 0;
                const isMedium = (contestRow.contests?.difficulty === "MEDIUM") ? 1 : 0;
                const isHard = (contestRow.contests?.difficulty === "HARD") ? 1 : 0;
                const reward = contestRow.contests?.reward ?? 0;

                const easySolved = (existing.easySolved ?? 0) + isEasy;
                const mediumSolved = (existing.mediumSolved ?? 0) + isMedium;
                const hardSolved = (existing.hardSolved ?? 0) + isHard;
                const totalXPAchieved = (existing.totalXPAchieved ?? 0) + reward;
                const currentTimeExecution = existing.currentTimeExecution ?? 0; // keep TODO

                rankMap.set(profileId, { easySolved, mediumSolved, hardSolved, totalXPAchieved, currentTimeExecution });
            });

            const profileMetricsList = userList.map(userRow => ({
                profileId: userRow,
                opsScore: Math.round(calculateOpsScore(rankMap.get(userRow) || defaultRank))
            }));

            // Store it in the database
            await db
                .insert(profileMetrics)
                .values(profileMetricsList)
                .onConflictDoUpdate({
                    target: profileMetrics.profileId,
                    set: { opsScore: sql`excluded.ops_score` },
                });

            console.log(`Chunk Number : ${chunkNumber - 1} processing completed`);
        }

        // Update the rank
        let rankNumber = 1;
        let chunkNumberForUsers = 0;
        while(true) {
            const userChunk = await db.select().from(profileMetrics).orderBy(desc(profileMetrics.opsScore)).limit(this.LIMIT).offset(chunkNumberForUsers * this.LIMIT);
            const userList = userChunk.map(userRow => userRow.profileId);
            if(userList.length === 0) {
                console.log("Processing completed");
                break;
            }

            console.log(`Processing Chunk Number : ${chunkNumberForUsers}`);
            chunkNumberForUsers += 1;

            // TODO: this approach is very slow
            for (const userRow of userList) {
                await db
                    .insert(profileMetrics)
                    .values({ profileId: userRow, rank: rankNumber })
                    .onConflictDoUpdate({
                        target: profileMetrics.profileId,
                        set: { rank: rankNumber },
                    });
                rankNumber++;
            }


        }

    }
}

const rankCommander = new RankCommander();
(async () => {
  try {
    await rankCommander.execute();
  } catch (err) {
    console.error("RankCommander failed:", err);
  } finally {
    process.exit(0);
  }
})();