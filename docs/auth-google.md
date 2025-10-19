Google authentication setup for this project

Required environment variables (add to .env.local for development):

- GOOGLE_CLIENT_ID: OAuth Client ID from Google Cloud
- GOOGLE_CLIENT_SECRET: OAuth Client Secret from Google Cloud
- NEXTAUTH_URL: Your site URL (e.g. http://localhost:3000 for development)

OAuth consent & redirect URI:

1. In Google Cloud Console, create an OAuth 2.0 Client ID for Web application.
2. Add the authorized redirect URI:
   - For local development: http://localhost:3000/api/auth/callback/google
   - For production: https://your-production-domain.com/api/auth/callback/google

Notes:
- The project already includes `next-auth` as a dependency; the Google provider is bundled with it.
- After adding the env vars, restart the Next.js dev server.
- The sign-in page is configured at `/api/auth/login` per `authOptions.pages.signIn`.

Quick test (development):

1. Create `.env.local` with the required vars.
2. Run:

```powershell
npm run dev
```

3. Visit `http://localhost:3000/api/auth/signin` or your app's sign-in UI to start Google sign-in.
