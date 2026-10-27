#!/usr/bin/env bash
# UserPromptSubmit hook: injects the engineering-insights reminder into context
# on every user prompt, so the read/record loop runs without relying on the
# model choosing to load the skill.
cat <<'JSON'
{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"engineering-insights: before any other step, run the `engineering-insights` skill. Read the INSIGHTS.md of the folder this request concerns (server/, client/, reviewer-core/, e2e/; root INSIGHTS.md when it names none or spans packages), unless it is already in context and unchanged, and say in one line which file you read and whether it was relevant. When this task or session finishes, run the skill's record step: add only non-obvious findings to that folder's INSIGHTS.md, or say \"nothing worth recording\"."}}
JSON
