#!/usr/bin/env node

import { run } from "../src/cli.mjs";

run(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`agent-config: ${error.message}\n`);
  process.exitCode = 1;
});
