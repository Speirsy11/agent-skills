---
name: delivery-proof
description: Use whenever a task's success is a message reaching someone — send,
  post, notify, remind, reply in another channel, or a scheduled message. Treat
  composing, sending, provider-accepted, and user-visible as four different
  states, and report only the strongest one actually evidenced.
---

Producing a reply, calling the send tool, the provider reporting delivery, and
the user *seeing* it are **four different states** — the logs repeatedly collapsed
them ("no Discord reply", a briefing marked delivered but never visible). A
message task is not done at "send returned"; it's done at the strongest transport
state you can actually prove.

## Steps

1. **Lock the destination.** Provider, account, channel/chat, thread, recipient,
   and the desired timing. A message to the wrong channel is a failed delivery,
   not a partial one.
   **Done when:** every destination field is a known value.

2. **Send once, idempotently.** Send a single time, with an idempotency key where
   the provider supports one, so a retry can't double-post.
   **Done when:** the send has been attempted exactly once per intended message.

3. **Capture the receipt.** Record the tool result and the message ID.
   **Done when:** you hold the provider's response and an ID if one exists.

4. **Read back where you can.** Fetch the message/thread to confirm it's actually
   there. If visibility genuinely can't be proven, report **"accepted by
   provider"** — not "delivered". Never upgrade the wording past the evidence.
   **Done when:** you've either confirmed visibility or explicitly labelled the
   uncertainty.

5. **On failure, route back to the originating channel** with the intended
   destination and the specific blocker — don't let a failed send vanish
   silently.
   **Done when:** either a message ID / read-back is recorded, or the failure is
   reported to the user with what was meant to go where.

## Boundary

Formatting and transport are different completion criteria: a beautifully
formatted string is complete *as content* (`discord-formatting` owns
presentation); a delivery task is complete only at the strongest verified
transport state. Scheduled/recurring sends inherit these rules through
`cron-hygiene`; a run reporting back on completion uses this as its final gate.
