\## User story



<!--

Reference to the story in telemed-ia-docs:

code-corhuila/telemed-ia-docs#NN

If this PR is infrastructure or tooling, write N/A and explain why.

\-->



\## What changes and why



<!--

3-5 lines: the problem this PR solves and the decision taken.

If the change is purely technical, say so.

\-->



\## How it was tested



<!--

\- Which tests cover the change.

\- Result of the `ci.yml` workflow (green/red).

\- Local commands executed and their result.

\- If the change affects the federation contract, whether the shell still

&#x20; loads the remote.

\-->



\## Promotion trace



<!--

Only for PRs targeting `qa` or `main`.

List each re-applied commit with its traceability line:



\- feat(portal): some change

&#x20; - cherry picked from commit <sha-in-origin>



For PRs targeting `develop`, write: N/A — PR targeting develop.

\-->



N/A — PR targeting develop.



\## Checklist



\- \[ ] No secrets or real credentials committed.

\- \[ ] No schema changes outside the `-db` repos.

\- \[ ] The portal does not implement its own HTTP client or session (norm 5.4.1).

\- \[ ] The federation contract (`./routes`) is preserved.

\- \[ ] The three permanent branches remain intact.

\- \[ ] Commit messages follow Conventional Commits.

\- \[ ] CI is green.

\- \[ ] Affected documentation updated.

