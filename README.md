# TaxMint Pro — FREE Edition (Google Gemini)
## Deploy in 10 minutes. $0 forever. No credit card needed.

---

## Files in this package
```
taxmint-gemini/
├── index.html      ← Full premium TaxMint Pro UI
├── api/chat.js     ← Backend (keeps your Gemini key secret)
├── vercel.json     ← Vercel deployment config
└── README.md       ← This file
```

---

## Step 1 — Get your FREE Gemini API key (2 minutes)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — it starts with `AIza...`

✅ No credit card. No billing. Free forever on the free tier.
   → 1,500 requests/day = ~50 clients asking 30 questions each, every day

---

## Step 2 — Deploy to Vercel (5 minutes)

### Option A: Drag & Drop (easiest)
1. Go to https://vercel.com and sign up free (use your Google account)
2. Click **"Add New Project"**
3. Choose **"Import Third-Party Git Repository"** or just drag the folder
4. Click **Deploy**

### Option B: GitHub (best for updates)
1. Create a free GitHub account at https://github.com
2. Create a new repository called `taxmint-pro`
3. Upload all 4 files from this folder
4. Go to https://vercel.com → Import from GitHub → select your repo → Deploy

### Option C: Vercel CLI (fastest)
```bash
npm install -g vercel
cd taxmint-gemini
vercel
# Follow prompts — done in 60 seconds
```

---

## Step 3 — Add your API key (CRITICAL — do this or it won't work)

1. In your Vercel project → click **Settings**
2. Click **Environment Variables** in the left sidebar
3. Click **Add New**:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** `AIza...your-key-here...`
   - **Environments:** check all three (Production, Preview, Development)
4. Click **Save**
5. Go to **Deployments** tab → find your latest deployment → click the **"..."** menu → **Redeploy**

---

## Step 4 — Share with clients

Vercel gives you a URL like:
```
https://taxmint-pro-yourname.vercel.app
```

Share this with clients. They open it and chat — no sign-up, no payment, nothing.

### Optional: Custom domain
Want `taxmint.yourfirm.ca`?
1. Buy a domain (~$12/year at namecheap.com or Google Domains)
2. In Vercel → Settings → Domains → Add your domain
3. Follow the DNS instructions (5 minutes)

---

## Free tier limits

| Item | Free allowance |
|------|----------------|
| Vercel hosting | 100 GB/month bandwidth |
| Gemini API requests | 1,500/day |
| Gemini tokens | 1,000,000/day |
| Cost | $0 |

For most small-to-mid firms, the free tier is more than enough forever.

---

## Upgrading later

If you ever need more capacity (e.g., 10,000+ requests/day), you can:
- Switch to Gemini paid tier (~$0.075 per 1M tokens — extremely cheap)
- Switch back to Anthropic Claude (better quality, small cost)

Just change `GEMINI_API_KEY` to `ANTHROPIC_API_KEY` in Vercel and swap the `api/chat.js` file.

---

## Troubleshooting

**"Server not configured" error:**
→ You haven't added the GEMINI_API_KEY environment variable. Follow Step 3.

**"No response from AI" error:**
→ Check your Gemini key is correct. Test it at aistudio.google.com.

**Blank page:**
→ Check Vercel deployment logs (Deployments → click your deploy → View Logs)
