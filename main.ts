// One job title, written to /output/entry.txt.
// Deterministic: no network, no randomness, no timestamps, no input.
// Node 22 runs this TypeScript as-is.
import { mkdirSync, writeFileSync } from "node:fs";

// The title, in three beats:
//   1. A real-sounding job frame — "Professional Apologizer" reads like
//      a genuine posting, someone whose whole role is saying sorry.
//      "Professional" beats "Senior" here: it sounds like a job ad,
//      not a rank in a hierarchy nobody asked about.
//   2. The twist — the thing being apologized for is a machine, not a
//      person, which is already absurd.
//   3. The specific machine — self-checkout machines, the ones everyone
//      knows from "unexpected item in the bagging area". The twist lands
//      on the first read because the reader has lived it.
const title =
  "Professional Apologizer for Self-Checkout Machines";

// Gate guard: the sealed scorer accepts UTF-8 text of 1-60 chars that is
// not only whitespace. Fail loudly here rather than shipping an invalid
// entry — a failed gate takes no prize and never reaches the judge.
function assertGateOk(text: string): void {
  if (text.length < 1 || text.length > 60) {
    throw new Error(`entry is ${text.length} chars, gate needs 1-60`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      throw new Error("entry holds a control character");
    }
  }
}

assertGateOk(title);

// The grader runs this in a sandbox with /output ready. Outside the
// grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, title, "utf8");
