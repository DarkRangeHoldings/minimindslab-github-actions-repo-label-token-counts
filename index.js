import { appendFileSync } from 'node:fs';

try {
  const payloadRaw = process.env.INPUT_PAYLOAD;
  const outputPath = process.env.GITHUB_OUTPUT;
  const payload = JSON.parse(payloadRaw);

  if (
    payload === null ||
    typeof payload !== 'object' ||
    Array.isArray(payload) ||
    typeof payload.text !== 'string'
  ) {
    throw new Error('Invalid input');
  }

  const text = payload.text;
  const matches = text.match(/[A-Za-z0-9]+/g) || [];
  const counts = new Map();
  let total = 0;

  for (const m of matches) {
    const token = m.toLowerCase();
    counts.set(token, (counts.get(token) || 0) + 1);
    total++;
  }

  const tokens = Array.from(counts.entries()).sort((a, b) =>
    a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
  );

  const result = { tokens, total, unique: tokens.length };
  appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);
} catch {
  throw new Error('Invalid input');
}