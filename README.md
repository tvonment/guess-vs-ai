# Guess vs AI

A word-guessing duel against an AI: you and the AI each pick a secret word from a category, then take turns asking yes/no questions to guess the other's word first. Built as a Progressive Web App.

**Live:** https://www.guess-vs-ai.com

## How it works

- Pick a section and category, enter your secret word (validated by an LLM against the category).
- The AI picks its own secret word for the same category.
- Take turns: you answer the AI's questions with Yes / No / I Don't Know buttons; the AI answers your free-text questions. A "Yes" lets the asker keep their turn.
- First to name the other's exact word wins. An LLM referee judges guesses (tolerant of typos, strict on identity).
- The **Study Buddy** sidebar helper answers factual questions about your own word (doc-grounded via the Microsoft Learn MCP server for Azure Services games) — but refuses to help with the game itself.

## Tech stack

- **Next.js 15** — App Router for the UI (`app/`), Pages Router for the API (`pages/api/`)
- **Azure AI Foundry** — LLM chat completions (gameplay + validation models), called via `fetch` from `services/`; the Study Buddy helper uses the **Vercel AI SDK** (`ai` + `@ai-sdk/azure` + `@ai-sdk/mcp`) for its tool loop against the MS Learn MCP server
- **Azure Cosmos DB** — game documents and feedback (`services/cosmosService.ts`)
- **Azure Static Web Apps** — hosting, deployed by `.github/workflows/production-pipeline.yml` on push/PR to `main`
- **Tailwind 3** + custom classes in `app/globals.css`, `next-pwa` for the PWA layer

## Project layout

```
app/                UI (single-page state machine in app/page.tsx, PageState-driven)
app/components/     Screens, game UI, modals
model/              Types and static data (categories, answers, game document shape)
pages/api/          API routes: start, humanguess, save, finish, statistics, feedback, issues, report
services/           LLM calls, prompts, turn logic, Cosmos access
infra/              Bicep IaC for the Foundry model deployments
archive/            Retired deep-analytics notebook (kept for reference, unused)
```

## Local development

```bash
cp .env.example .env.local   # then fill in real values
npm install
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_ENVIRONMENT` | `LOCAL` / `DEV` / `TEST` — shows the corner version ribbon (unset/`PROD` shows nothing) |
| `AZURE_AI_FOUNDRY_API_KEY` | API key of the Azure AI Foundry resource |
| `AZURE_AI_FOUNDRY_ENDPOINT` | Base URL, e.g. `https://<resource>.cognitiveservices.azure.com/` — calls use the Foundry v1 API (`{endpoint}/openai/v1/chat/completions`) |
| `AI_GAME_MODEL` | Deployment name of the gameplay model (e.g. `gpt-5.4`) |
| `AI_VALIDATION_MODEL` | Deployment name of the validation model (e.g. `gpt-5-mini`) |
| `COSMOS_DB_CONNECTION_STRING` | Cosmos DB connection string |
| `COSMOS_DB_DATABASE_NAME` | Cosmos database name |
| `COSMOS_DB_CONTAINER_NAME` | Games container name (the `feedback` container is fixed by name) |

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build (also generates the PWA service worker into `public/`)
- `npm run lint` — ESLint via `next lint`

## Deployment

Pushing to `main` (or opening a PR against it) triggers the Azure Static Web Apps workflow. Secrets/vars are configured in the GitHub repo settings (`GVA-Prod` environment): the env vars above plus `AZURE_STATIC_WEB_APPS_API_TOKEN_*`.

### Infrastructure (Bicep)

The Foundry model deployments (`gpt-5.4` + `gpt-5-mini`) are provisioned by `infra/main.bicep` through `.github/workflows/infra-pipeline.yml` — pull requests touching `infra/**` get a **what-if** preview, pushes to `main` (or a manual run) deploy. The template can also create a fresh project-based Foundry account (`createAccount=true`); its outputs map 1:1 to the `AZURE_AI_FOUNDRY_ENDPOINT` / `AI_GAME_MODEL` / `AI_VALIDATION_MODEL` env vars.

One-time setup for the pipeline's secretless (OIDC) Azure login — create an app registration with a federated credential for this repo and grant it Contributor on the resource group:

```bash
az ad app create --display-name guess-vs-ai-github
az ad sp create --id <appId>
az role assignment create --assignee <appId> --role Contributor \
  --scope /subscriptions/<subId>/resourceGroups/<rg>
az ad app federated-credential create --id <appId> --parameters '{
  "name": "gva-prod", "issuer": "https://token.actions.githubusercontent.com",
  "subject": "repo:tvonment/guess-vs-ai:environment:GVA-Prod",
  "audiences": ["api://AzureADTokenExchange"] }'
```

Then set these GitHub **variables** on the `GVA-Prod` environment: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `AZURE_AI_FOUNDRY_ACCOUNT_NAME` (= `guess-vs-ai-resource`).
