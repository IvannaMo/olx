import "dotenv/config";
import { createClient } from "redis";


export const clientRedis = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
