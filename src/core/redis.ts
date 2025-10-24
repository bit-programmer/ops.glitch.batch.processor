import Redis from "ioredis";
import env from "./env";

export const redis = new Redis({
    port: Number(env.REDIS_PORT_NUMBER),
    host: env.REDIS_HOST,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    db: 0,
    maxRetriesPerRequest: null
});
