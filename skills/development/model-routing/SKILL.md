---
name: model-routing
description: Choose cost-efficient OpenAI models and reasoning effort for subagents,
  workers, reviewers, coding CLIs, scheduled jobs, and agent configuration.
---

# Model routing

Honor explicit model/effort requests. Otherwise choose the cheapest route likely
to pass acceptance. These defaults are inferred from OpenAI's descriptions;
validate them on your workload.

| Model ID | Use for | Starting effort | API input / output per 1M tokens |
|---|---|---|---|
| `gpt-5.6-luna` | Simple information retrieval, extraction, classification, repetitive edits, and straightforward tool calls with clear inputs and checks | low | $0.20 / $1.20 |
| `gpt-5.6-terra` | Everyday coding, bounded bug fixes, and multi-step work with a known design and reliable tests | medium | $2 / $12 |
| `gpt-5.6-sol` | Complex implementation, debugging, review, and orchestration requiring substantial judgment | medium; high for difficult reasoning | $4 / $20 |
| `gpt-6-astra` | Hardest end-to-end work: ambiguous architecture, difficult research, cross-system diagnosis, and demanding code/browser workflows | medium; high when warranted | $10 / $50 |

## Apply the route

- Check runtime model/effort support; API and Codex controls differ. Use `none`
  for mechanical work where supported. Reserve `xhigh` and above for demonstrated need.
- Before spawning, tell the user the exact model, reasoning level, and brief
  reason. Supply objective, inputs, scope, acceptance check, and stop conditions.
  The supervisor verifies the result. Record model/effort in scheduled jobs too.
- Use Luna for clear, repeatable tool workflows; start higher for ambiguity or
  costly mistakes. Escalate after one failed correction; skip tiers when needed.
  Model escalation does not fix permissions, authentication, or broken tools.
- Minimize cost per accepted result: context, reasoning, tools, and retries.
  Keep handoffs small; avoid delegation overhead for trivial work. Astra can
  cost less overall on hard tasks despite higher token prices.

Prices checked 2026-09-08: standard API text rates up to 272K input tokens,
not Codex subscription rates. Caching, tools, service tiers, and longer prompts
change cost. Recheck before budget commitments.

Sources: [Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna),
[Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra),
[Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol),
[Astra](https://developers.openai.com/api/docs/models/gpt-6-astra),
[Astra guidance](https://developers.openai.com/api/docs/guides/latest-model).
