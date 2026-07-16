Run the verification checklist for the current phase from docs/ARCHITECTURE.md.

Steps:
1. Read docs/ARCHITECTURE.md and find the checklist for the current phase listed in docs/CLAUDE.md
2. Run: npx tsc --noEmit
3. Check every item on the phase checklist against the actual codebase
4. Report: PASS or FAIL for each item
5. List any failing items with the file and reason
6. Do not mark the phase complete unless every item passes
