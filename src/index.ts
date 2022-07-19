import express from "express";
import {
    createEnvelope,
    deleteEnvelope,
    Envelope,
    readEnvelope,
    readEnvelopes,
    updateEnvelope,
} from "./db/queries";
const app = express();
const PORT = process.env["PORT"] || 8080;

declare global {
    namespace Express {
        interface Request {
            envelope?: Envelope;
        }
    }
}

app.param("category", async (req, res, next) => {
    const category = req.params["category"];
    const envelope = await readEnvelope(category);

    if (envelope === undefined) {
        res.status(404).send("Envelope with matching category not found.");
        return;
    }
    req.envelope = envelope;
    next();
});

app.get("/", (req, res) => {
    res.send("Budget App");
});

app.get("/envelopes", async (req, res) => {
    const envelopes = await readEnvelopes();
    res.json(envelopes);
});

app.get("/envelopes/:category", (req, res) => {
    res.send(req.envelope);
});

app.put("/envelopes/:category", express.json(), async (req, res) => {
    const envelope = req.body as Envelope;
    if (!envelope) {
        res.status(400).send("Invalid envelope.");
        return;
    }

    const category = req.params.category;
    if (envelope.category !== category) {
        res.status(400).send(
            "Envelope category in body does not match envelope category in path."
        );
        return;
    }

    await updateEnvelope(envelope);
    res.send(await readEnvelope(category));
});

app.delete("/envelopes/:category", async (req, res) => {
    await deleteEnvelope(req.params.category);
    res.status(204).send();
});

app.post("/envelopes/:category/exchange", async (req, res) => {
    const amount = Number.parseFloat(req.query["amount"] as string);
    if (amount === NaN) {
        res.status(400).send("Invalid amount.");
        return;
    }

    const category = req.params.category;
    const envelope = req.envelope as Envelope;
    envelope.balance += amount;

    await updateEnvelope(envelope);
    res.send(await readEnvelope(category));
});

app.post("/new-envelope", express.json(), async (req, res) => {
    const envelope = req.body as Envelope;
    if (!envelope) {
        res.status(400).send("Invalid envelope.");
        return;
    }

    const category = envelope.category;
    if (await readEnvelope(category)) {
        res.status(400).send("Envelope category already exists.");
        return;
    }

    await createEnvelope(envelope);
    res.status(201).send(await readEnvelope(category));
});

app.listen(PORT, () => {
    console.log(
        `Express server listening on port ${PORT} in ${app.settings.env} mode`
    );
});
