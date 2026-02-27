import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Force HTTP fetch for reliability
(neonConfig as any).useFetch = true;
// Also provide WebSocket constructor in case it's needed for other parts
if (!neonConfig.webSocketConstructor) {
  neonConfig.webSocketConstructor = ws;
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter, log: ["error", "warn"] });

export default prisma;
