import { spawnSync } from "node:child_process";

const commands = [
  {
    label: "Running lint checks",
    command: "npm",
    args: ["run", "lint"],
  },
  {
    label: "Running unit tests",
    command: "npm",
    args: ["test"],
  },
  {
    label: "Running production build",
    command: "npm",
    args: ["run", "build"],
  },
];

for (const step of commands) {
  console.log(`\n▶ ${step.label}\n`);

  const result = spawnSync(step.command, step.args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.error(`\n✕ ChronoForge preflight failed during: ${step.label}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\n✓ ChronoForge preflight passed.");