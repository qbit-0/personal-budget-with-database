import { Pool, QueryResult } from "pg";

const pool = new Pool({
    user: "me",
    host: "localhost",
    database: "postgresql-acute-87514",
    password: "password",
    port: 5432,
});

export default pool;
