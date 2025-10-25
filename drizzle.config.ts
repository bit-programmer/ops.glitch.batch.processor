import env from "./src/core/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/core/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: env.SUPUBASE_DATABASE_URL,
    },
});
