import type { Config } from "drizzle-kit";

export default {
  schema: "./shared/schema.ts", 
  out: "./shared/drizzle",
  dialect: "postgresql",               
  dbCredentials: {
    url: process.env.DATABASE_URL!,    
  },
} satisfies Config;