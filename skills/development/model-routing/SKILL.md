---
name: model-routing
description: Choose cost-efficient OpenAI models and reasoning effort for subagents,
  workers, reviewers, coding CLIs, scheduled jobs, and agent configuration.
---

# Model routing

Match the model to the task's size and complexity. Use the smallest model that
can do the work reliably, and honor explicit model or effort requests.

| Model ID | Use for | Starting effort |
|---|---|---|
| `gpt-5.6-luna` | Simple information retrieval, extraction, classification, repetitive edits, and straightforward tool calls | low |
| `gpt-5.6-terra` | Everyday coding, bounded bug fixes, and multi-step work with a known design | medium |
| `gpt-5.6-sol` | Complex implementation, debugging, review, and orchestration requiring substantial judgment | medium |
| `gpt-6-astra` | Hardest end-to-end work: ambiguous architecture, difficult research, cross-system diagnosis, and demanding code/browser workflows | medium or high |

Use supported reasoning levels: low for simple work, medium for ordinary
problem-solving, high for difficult reasoning. Reserve xhigh and above for
exceptionally demanding tasks. Increase model strength or effort when needed.
Before spawning a subagent, tell the user its model and reasoning level.
