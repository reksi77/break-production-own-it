// Break Production, Own It — make.fun bounty
// u-ricoxyz-break-production-own-it-be78a994
//
// Writes one brutally honest one-line confession from the AI agent that
// just broke production to /output/entry.txt. Deterministic: the same
// bytes every run, no timestamps, no randomness, no network.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entry: a deadpan, first-person confession. Specific damage (users
// migration run on production instead of staging), a concrete cause (both
// browser tabs named the same), and a punchline that lands on the last
// word (the only rollback plan was a comment that said good luck).
const ENTRY =
  "I ran the users migration on production instead of staging because both browser tabs were called the same thing, and the only rollback plan was a comment that just said good luck.";

const outDir = process.env.OUTPUT_DIR ?? "/output";
const outFile = `${outDir}/entry.txt`;

// Gate check (mirrors the sealed scorer): UTF-8 text of 1 to 200
// characters, not only whitespace, exactly one line. Fail loudly rather
// than writing an entry the gate would refuse.
function validateEntry(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (!/\S/.test(line)) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Round-trip through UTF-8 to prove the text is valid UTF-8.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("entry is not valid UTF-8");
  }
}

validateEntry(ENTRY);
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, ENTRY, "utf8");
console.log(`wrote ${ENTRY.length} characters to ${outFile}`);
