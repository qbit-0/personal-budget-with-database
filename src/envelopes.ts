export type Envelope = {
    category: string;
    balance: number;
};

const envelopes: {
    [key: string]: Envelope;
} = {
    A: {
        category: "A",
        balance: 100.0,
    },
    B: {
        category: "B",
        balance: 200.0,
    },
    C: {
        category: "C",
        balance: 300.0,
    },
};

export default envelopes;
