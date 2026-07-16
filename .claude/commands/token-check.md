Verify no design token violations exist in the codebase.

Steps:
1. Search all files in components/ for hardcoded hex values (any #RRGGBB or #RGB pattern that is not in a comment)
2. Search all files in components/ for hardcoded font sizes (any fontSize: followed by a number not referencing typography tokens)
3. Search all files in components/ for hardcoded spacing values (any padding or margin followed by a number not referencing spacing tokens)
4. Search for any import of colors or values not from @/theme
5. Report each violation with file name and line number
6. If zero violations found, confirm: "All tokens correct — no hardcoded values detected"
