/**
 * Drizzle Database Connection
 * Configure and export Drizzle database instance
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "./dbConnection.js";
import * as schema from "./drizzle-schema.js";

// Create Drizzle instance with existing pool connection
export const db = drizzle(pool, { schema });
