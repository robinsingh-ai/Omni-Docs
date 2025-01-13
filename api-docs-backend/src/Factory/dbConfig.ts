
// db.ts
import { Pool } from 'pg';
const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 5432;
const database = process.env.DB_NAME || 'checkout_service';
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const pool = new Pool({
    host,
    port,
    database,
    user: username,
    password,
});
export default pool;

