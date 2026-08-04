---
id: typescript-safety
title: TypeScript safety
description: Preserve type safety instead of silencing the compiler.
default: true
---

- Never use `as any`, `as unknown as T`, unchecked assertions, or non-null assertions merely to silence TypeScript.
- Narrow unknown values with runtime validation, discriminated unions, type guards, or a better API and type design.
- If an assertion is genuinely unavoidable at an external boundary, isolate it, validate the value first, explain why it is safe, and test that boundary.
- Encode important invariants in types, constructors, and API boundaries. Make invalid states unrepresentable where practical.
