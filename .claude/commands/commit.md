Run TypeScript check, token check, then commit.

Steps:
1. Run: npx tsc --noEmit
   If errors exist: stop and report them. Do not commit.
2. Run the token-check command
   If violations exist: stop and report them. Do not commit.
3. If both pass, run:
   git add .
   git status (show me what will be committed)
   Ask me to confirm the commit message before committing
4. After I confirm: git commit -m "[message]" && git push
5. Report the commit hash after pushing
