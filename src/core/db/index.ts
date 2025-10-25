import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import env from "../env";

const client = postgres(env.SUPUBASE_DATABASE_URL);
export const db = drizzle({ client });
