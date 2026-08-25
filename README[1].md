# NYVELLA — Vercel + Supabase

## 1. Supabase
Create a Supabase project, open **SQL Editor**, and run:

`supabase/schema.sql`

## 2. Vercel
Import this folder/repository into Vercel.

Add these Environment Variables in Vercel:
- `SUPABASE_URL` = your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role key

Do NOT put the service-role key in `index.html` or any browser-side JavaScript.

## 3. Deploy
Vercel detects `index.html` and the `/api/whitelist.js` serverless function automatically.

The form sends:
- X/Twitter handle
- EVM wallet address
- server-generated timestamp
- status = pending

Applications are stored in `whitelist_applications`.

## 4. Local test
You can deploy directly with Vercel CLI, or use any local static/serverless-compatible Vercel setup.

## Security
The Supabase service-role key is only used inside `/api/whitelist.js`.
Public users cannot read the whitelist table through Supabase REST because RLS is enabled and table privileges are revoked for `anon` and `authenticated`.

## Important
The page text currently says “Official Launch • Robinhood L2 Ecosystem” and “Listed on OpenSea”. Only keep those claims if they are accurate for your project.
