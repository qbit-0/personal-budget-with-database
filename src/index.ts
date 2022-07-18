import envelopes, { Envelope } from "./envelopes";

import express from "express";
const app = express();
const port = process.env["PORT"] || "8080";

declare global {
    namespace Express {
        interface Request {
            envelope?: Envelope;
        }
    }
}

app.param("category", (req, res, next) => {
    const category = req.params["category"];
    const envelope = envelopes[category];
    if (envelope === undefined) {
        res.status(404).send("Envelope with matching category not found.");
        return;
    }
    req.envelope = envelope;
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/envelopes", (req, res) => {
    res.send(envelopes);
});

app.get("/envelopes/:category", (req, res) => {
    res.send(req.envelope);
});

app.put("/envelopes/:category", express.json(), (req, res) => {
    const body = req.body;
    const envelope = body as Envelope;
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

    if (!envelopes[category]) {
        envelopes[category] = envelope;
        res.status(201).send(envelopes[category]);
    } else {
        envelopes[category] = envelope;
        res.send(envelopes[category]);
    }
});

app.delete("/envelopes/:category", (req, res) => {
    delete envelopes[req.params.category];
    res.status(204).send();
});

app.post("/envelopes/:category/exchange", (req, res) => {
    const amount = Number.parseFloat(req.query["amount"] as string);
    if (amount === NaN) {
        res.status(400).send("Invalid amount.");
    }

    const category = req.params.category;
    envelopes[category].balance += amount;
    res.send(envelopes[category]);
});

app.post("/new-envelope", express.json(), (req, res) => {
    const envelope = req.body as Envelope;
    if (!envelope) {
        res.status(400).send("Invalid envelope.");
        return;
    }

    const category = envelope.category;
    if (envelopes[category]) {
        res.status(400).send("Envelope category already exists.");
    }

    envelopes[category] = envelope;
    res.status(201).send(envelopes[category]);
});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
