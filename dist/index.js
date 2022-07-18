"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envelopes_1 = __importDefault(require("./envelopes"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.param("category", (req, res, next) => {
    const category = req.params["category"];
    const envelope = envelopes_1.default[category];
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
    res.send(envelopes_1.default);
});
app.get("/envelopes/:category", (req, res) => {
    res.send(req.envelope);
});
app.put("/envelopes/:category", express_1.default.json(), (req, res) => {
    const body = req.body;
    const envelope = body;
    if (!envelope) {
        res.status(400).send("Invalid envelope.");
        return;
    }
    const category = req.params.category;
    if (envelope.category !== category) {
        res.status(400).send("Envelope category in body does not match envelope category in path.");
        return;
    }
    if (!envelopes_1.default[category]) {
        envelopes_1.default[category] = envelope;
        res.status(201).send(envelopes_1.default[category]);
    }
    else {
        envelopes_1.default[category] = envelope;
        res.send(envelopes_1.default[category]);
    }
});
app.delete("/envelopes/:category", (req, res) => {
    delete envelopes_1.default[req.params.category];
    res.status(204).send();
});
app.post("/envelopes/:category/exchange", (req, res) => {
    const amount = Number.parseFloat(req.query["amount"]);
    if (amount === NaN) {
        res.status(400).send("Invalid amount.");
    }
    const category = req.params.category;
    envelopes_1.default[category].balance += amount;
    res.send(envelopes_1.default[category]);
});
app.post("/new-envelope", express_1.default.json(), (req, res) => {
    const envelope = req.body;
    if (!envelope) {
        res.status(400).send("Invalid envelope.");
        return;
    }
    const category = envelope.category;
    if (envelopes_1.default[category]) {
        res.status(400).send("Envelope category already exists.");
    }
    envelopes_1.default[category] = envelope;
    res.status(201).send(envelopes_1.default[category]);
});
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map