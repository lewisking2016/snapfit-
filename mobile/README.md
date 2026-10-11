# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## AI coach proxy

The in-app AI coach ("Marcus") talks to Gemini through a server-side API route, so the Gemini API key **never ships in the app bundle**.

- **Route:** [`src/app/api/coach+api.ts`](./src/app/api/coach+api.ts) — an [Expo Router API route](https://docs.expo.dev/router/reference/api-routes/) serving `POST /api/coach`.
- **Client:** [`src/services/coach.ts`](./src/services/coach.ts) posts `{ question, context? }` and receives `{ text }`; on any failure it falls back to a local reply (`src/data/coach-fallback.ts`), so the chat keeps working without the network.

### Setup

1. Copy `.env.example` to `.env` and fill in your key (get one at <https://aistudio.google.com/apikey>):

   ```bash
   cp .env.example .env
   ```

2. Start the dev server — API routes are served automatically:

   ```bash
   npx expo start
   ```

| Variable | Where it lives | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | Server only (`process.env`) | Authenticated to Google as the `x-goog-api-key` header inside the route. **Never** prefix with `EXPO_PUBLIC_` — that would inline the secret into the JS bundle anyone can download. |
| `EXPO_PUBLIC_API_URL` | Client (safe to expose) | Optional. Origin of this app's API server so a physical device on your LAN can reach `/api/coach`. Unset in dev: the dev-server `hostUri` is detected automatically. |

### How the key stays isolated

- The route reads `process.env.GEMINI_API_KEY` **at request time on the server**. Expo only inlines `EXPO_PUBLIC_*` vars into the client bundle, so a plain `GEMINI_API_KEY` cannot end up in the app.
- No server code is imported by any client module — the only client→server surface is the HTTP call to `POST /api/coach`.
- The key is never logged; upstream errors log the HTTP status only, and error responses to the client are generic (no config details, payloads, or upstream bodies).
- The request body is validated (question trimmed, ≤1000 chars; optional context ≤2000 chars), the Gemini call is wrapped in a 15s timeout, and markdown/code fences are stripped from the reply before it reaches the chat bubble.

### Model & endpoint

| | |
| --- | --- |
| Endpoint | `POST https://generativelanguage.googleapis.com/v1beta/interactions` |
| Model | `gemini-3.8-flash` |
| Auth | `x-goog-api-key: $GEMINI_API_KEY` header |
| Payload | `{ model, system_instruction, input, generation_config }` |
| Docs | <https://ai.google.dev/gemini-api/docs/text-generation> |

### Production note

`app.json` sets `web.output: "static"`, which pre-renders pages and does **not** run API routes. Static export, EAS Hosting with server functions, or a custom Node/hosted deployment that executes `+api` routes is required for the coach proxy to work in production; in local development `npx expo start` serves it as expected.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
