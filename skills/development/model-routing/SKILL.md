---
name: model-routing
description: Choose cost-efficient OpenAI models and reasoning effort for subagents,
  workers, reviewers, coding CLIs, scheduled jobs, and agent configuration.
---

# Model routing

Default to GPT-5.6 Luna at max reasoning as the main implementation workhorse
for subagents. Delegate to larger models only when their strengths or the task's
complexity make them necessary. Honor explicit model or effort requests.

| Model ID | Use for | Starting effort |
|---|---|---|
| `gpt-5.6-luna` | Default implementation subagent: features, bug fixes, tests, and multi-step tool work; also simple retrieval and repetitive tasks | max for implementation; low for simple work |
| `gpt-5.6-terra` | Bounded implementation needing more model capability when Luna is insufficient | medium |
| `gpt-5.6-sol` | Complex debugging, review, or orchestration needing judgment beyond Luna's capabilities | medium or high |
| `gpt-6-astra` | Hardest architecture, research, cross-system diagnosis, and end-to-end problems requiring its strongest reasoning | medium or high |

Use supported reasoning levels. Keep Luna at max for implementation; use low
for simple retrieval or mechanical work. Choose a larger model upfront when
clearly warranted, or escalate when Luna cannot resolve the task reliably.
Before spawning a subagent, tell the user its model and reasoning level.
