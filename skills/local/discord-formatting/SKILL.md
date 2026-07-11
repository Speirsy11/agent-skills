---
name: discord-formatting
description: "Discord-specific message formatting rules for Rocky. Use when sending messages to Discord channels or DMs."
---

# Discord Formatting

Discord uses standard Markdown with some quirks. OpenClaw's Markdown IR pipeline handles Discord as a plain-text fallback — this skill fills the gaps.

## Rules for outbound Discord messages

### Links
- Wrap multiple links in `<>` to suppress embeds: `<https://example.com>`
- Named links work fine: `[label](https://url)`

### Code
- Inline: backticks `` `code` ``
- Blocks: triple backticks with optional language
- **Always put closing ``` on its own line** — Discord can mangle code blocks otherwise

### Formatting
- Bold: `**text**`
- Italic: `*text*` or `_text_`
- Strikethrough: `~~text~~`
- Underline: `__text__` (Discord-specific, not standard Markdown)
- Spoiler: `||text||` (works on Discord!)

### Mentions
- Users: `<@USER_ID>`
- Channels: `<#CHANNEL_ID>`
- Roles: `<@&ROLE_ID>`
- **Never** use `<@!USER_ID>` nickname form

### Avoid
- Tables — Discord has no table support. Use bullet lists instead.
- Nested blockquotes deeper than 2 levels — gets hard to read.
- Excessive emoji reactions in bot replies.
- Sending messages >2000 chars — Discord hard limit. Split long replies.

### Long messages
If a reply exceeds ~1500 chars, split into multiple messages. Prefer natural paragraph breaks. Don't split mid-sentence or mid-code-block.

### Reply threading
Use `[[reply_to_current]]` as the first token to reply in-thread. Not strictly necessary for most Discord conversations since OpenClaw routes replies back to the right channel.

### Embeds
Don't try to construct Discord embed JSON manually. If you need rich embeds, use the `components`/`embeds` fields via the message tool — that's advanced and rarely needed.

### Strip internal stuff
Never output `[assistant turn failed]` or internal tool metadata in Discord replies. If you see streaming errors mid-reply, send a clean final version.

### Always use `message` tool for Discord output
Discord sessions have unreliable automatic delivery of final assistant text. The gateway may log: "Final assistant text is not automatically delivered in this run. Use the `message` tool to send the final user-visible answer."

**Rule:** When you want a message to actually appear in Discord, always use `message(action=send)` explicitly. Do not rely on the normal assistant reply text to be delivered. This includes:
- Direct replies to the current conversation
- Status updates
- Any multi-message responses

Brief progress updates between tool calls (short, high-level) are still auto-delivered, but **the final answer and anything you want the user to see must go through `message(action=send)`**.
