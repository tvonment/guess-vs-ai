# Prompt & model reference (v3)

The prompts live in code — this file documents the strategy so it has one place to be reasoned about. Update it when the prompts change.

## Models

| Tier | Env var | Deployment (default) | Used for |
|---|---|---|---|
| `game` | `AI_GAME_MODEL` | `gpt-5.6-terra` | Word selection, questions/guesses, opening line, playful comments, summary |
| `validation` | `AI_VALIDATION_MODEL` | `gpt-5.6-luna` | Win check, category check, answering the human's questions, Classroom learn fact |

All calls go through `services/llmService.ts` → Foundry v1 API (`{endpoint}/openai/v1/chat/completions`, deployment name in the `model` body field, no `api-version`). Only `messages`, `max_completion_tokens`, `reasoning_effort`, and `response_format` are sent — GPT-5.x deployments reject `temperature`/`top_p`.

## Design principles (v3)

- **No few-shot.** v2 burned ~1,300 tokens on win-check examples and ~850 on category-check examples per call; GPT-5.6 follows concise instructions reliably. v2's examples also referenced categories that no longer existed.
- **Validators are structured, minimal-token calls on the validation model** with `reasoning_effort: "none"` and a strict JSON schema. Parsing is defensive (`services/validationService.ts`), never a `===` on raw model text.
- **The game history itself is the AI's context** for question-asking (`getFilteredAiChatHistory`: the AI's questions + the human's button answers only).

## Output contracts (`services/validationService.ts`)

| Check | Schema | Maps to |
|---|---|---|
| `checkWin(guess, word)` | `{ "result": boolean }` | `boolean` — fuzzy on spelling, strict on identity; attribute descriptions are never a win |
| `checkWordInCategory(word, category)` | `{ "result": boolean }` | `boolean` — is the word a real, fitting member of the category |
| `answerQuestion(question, aiWord)` | `{ "answer": "yes" \| "no" \| "i_dont_know" }` | `Answer` enum — doubles as player-visible text; turn logic branches on the enum (only `YES` keeps the asker's turn) |

## Answer scale (v3)

Three values: **Yes / No / I Don't Know** (`model/Answer.ts`). Only a plain "Yes" lets the asker keep the turn — for both the human answering the AI (buttons) and the AI answering the human. The v2 "Probably Yes/No" tiers were removed.

## Gameplay prompts (`services/aiMessagesService.ts`, `services/aiWordSelectionService.ts`)

- `makeGuess` — system sandwich: rules + answer vocabulary, then filtered history, then a "output only the question or guess" task message. `reasoning_effort: "low"`.
- `selectWord` — pick a recognizable-but-not-obvious word; excludes the 50 most recently used AI words for the category (bounded query). Output: bare word only.
- `startMessage` / `makePlayfulComment` / `makeSummary` — creative one-offs, `reasoning_effort: "none"`. The summary renders through the `system` message style and is the only 800-token call.
- `makeLearnFact` — Classroom-only post-game educational blurb about both secret words (validation tier, 400 tokens, `reasoning_effort: "none"`); stored as `learnFact` on the game doc and shown in the game-over modal.
