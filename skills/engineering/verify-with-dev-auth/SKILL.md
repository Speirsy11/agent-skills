---
name: verify-with-dev-auth
description: Use a development-only Clerk bypass to verify protected app changes in a real browser.
---

# Verify with development auth

Use the repository's development-only Clerk bypass to exercise protected routes
as a seeded local user. Treat this as verification infrastructure, not a
convenience login.

## Discover the mechanism

1. Read the repository instructions and package scripts.
2. Search for `DEV_AUTH_USER_ID`, `devAuthUserId`, `resolveAuth`,
   `isDevAuthEnabled`, `assertDevAuthNotInProduction`, and Playwright
   configuration.
3. Confirm all three safety layers exist before enabling it:
   - the bypass returns a user only when `NODE_ENV === "development"`;
   - startup refuses production when `DEV_AUTH_USER_ID` is set;
   - Clerk middleware/proxy is skipped only under that same development guard.
4. Confirm protected server entry points resolve auth through the repository's
   shared auth helper. Direct `auth()` calls can accidentally ignore the
   bypass.

If a repository lacks these guards, do not improvise an unguarded bypass. Add
or repair the standard mechanism as part of the requested implementation and
test it first.

## Prepare a verification user

The configured ID must represent an existing local database user. Prefer the
repository's deterministic seed command and its documented default test ID.
Never use a production user, production database, real Clerk session token, or
deployed environment.

Run the seed command before the app when protected routes depend on user-owned
rows. Keep the same ID in the seed command and `DEV_AUTH_USER_ID`.

## Start the real app

Start the repository's normal development command with
`DEV_AUTH_USER_ID=<seeded-local-id>`. Do not place this variable in shared,
preview, CI, or production configuration.

Wait for the documented local URL to become healthy. Record the exact repo,
command, URL, route, user ID, and data source so verification cannot drift to
another local service.

## Verify through the browser

Prefer the repository's Playwright suite when present:

1. Run the focused protected-route spec first.
2. Visit the exact changed route through the running application.
3. Assert a protected, user-specific element is visible and that the sign-in
   screen is absent.
4. Exercise the changed interaction, not merely page load.
5. Capture the relevant assertion output and, for visual changes, a screenshot
   at the target viewport.

When no Playwright suite exists, use the available browser automation tool
against the running local URL. Add Playwright to the repository only when
repeatable browser verification is part of the repository's intended test
surface; do not make the skill depend on a globally installed browser tool.

## Safety and negative checks

Before claiming success, prove:

- focused auth tests pass;
- `DEV_AUTH_USER_ID` is ignored in test/non-development mode;
- production startup/configuration fails when the variable is set;
- the protected route works in development for the seeded local user;
- without the bypass, the same protected route still follows Clerk's normal
  unauthenticated behavior;
- no bypass value was committed to an env file or deployment configuration.

Stop immediately if the bypass activates outside local development, if a
protected entry point still calls Clerk directly, or if the database target is
not known to be local.

## Report evidence

Report the exact commands, route, viewport if visual, assertions observed,
test/build results, and any verification surface that remains unexercised. A
screenshot alone is not proof of authenticated server behavior; pair it with a
protected user-specific assertion.
