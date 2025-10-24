import dotenv from "dotenv";
import { z } from "zod";
import { CURRENT_NODE_ENV, NODE_ENVIRONMENTS } from "../utils/constants";

dotenv.config({ path: `.env.${CURRENT_NODE_ENV}` });

const schema = z.object({
    NODE_ENV: z.enum(NODE_ENVIRONMENTS).default("development"),
    REDIS_PORT_NUMBER: z.string(),
    REDIS_HOST: z.string(),
    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string()
});


const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    console.log("Environment variables are not loaded properly", JSON.stringify(parsed.error, null, 4));
    process.exit(1);
}

export default parsed.data;
