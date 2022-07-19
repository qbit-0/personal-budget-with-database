import { Pool, QueryResult } from "pg";

const pool = new Pool({
    user: "khlsnukjlshexg",
    host: "ec2-54-87-179-4.compute-1.amazonaws.com",
    database: "da4dmaap3o57ht",
    password:
        "f5d83a018492e592d094dd93c2ed58f4779eff4bb472c3fd269ee26a438973a0",
    port: 5432,
});

export default pool;
