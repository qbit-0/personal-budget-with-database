import pool from "./index";
import pg from "pg";

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
    return parseFloat(value);
});

export type Envelope = {
    category: string;
    balance: number;
};

export const createEnvelope = async (envelope: Envelope) => {
    await pool.query(
        "INSERT INTO envelopes (category, balance) VALUES ($1, $2)",
        [envelope.category, envelope.balance]
    );
};

export const readEnvelopes = async () => {
    return (await pool.query("SELECT * FROM envelopes", [])).rows as Envelope[];
};

export const readEnvelope = async (category: string) => {
    return (
        await pool.query("SELECT * FROM envelopes WHERE category = $1", [
            category,
        ])
    ).rows[0] as Envelope;
};

export const updateEnvelope = async (envelope: Envelope) => {
    await pool.query(
        "UPDATE envelopes SET category = $1, balance = $2 WHERE category = $1",
        [envelope.category, envelope.balance]
    );
};

export const deleteEnvelope = async (category: string) => {
    await pool.query("DELETE FROM envelopes WHERE category = $1", [category]);
};
