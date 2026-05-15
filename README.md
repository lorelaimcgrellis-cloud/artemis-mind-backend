# Artemis Mind Backend

Backend proxy server for Artemis Mind prototype. Solves CORS issues by proxying Claude API calls through a Node.js server.

## What This Does

- **Proxy server** that forwards Claude API requests from the frontend
- **No CORS issues** - API calls go through your server, not directly from browser
- **API key security** - users provide their own Claude API keys
- **Stateless** - all user data stored in browser localStorage

## Quick Start (Local Testing)

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Then open http://localhost:3001 in your browser.

## Deployment Options

### Option 1: Render (Easiest - Free Tier)

1. Push this code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Click "Create Web Service"
7. Wait ~2 minutes for deployment
8. Share the URL with test users!

### Option 2: Railway (Also Easy)

1. Push to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Railway auto-detects Node.js
6. Deploy!

### Option 3: Heroku

```bash
# Install Heroku CLI first
heroku login
heroku create artemis-mind-prototype
git push heroku main
heroku open
```

### Option 4: Fly.io

```bash
# Install flyctl
fly launch
fly deploy
```

## File Structure

```
artemis-backend/
├── server.js           # Express backend (proxies Claude API)
├── package.json        # Dependencies
├── public/
│   └── index.html     # Frontend app (React + localStorage)
└── README.md          # This file
```

## How It Works

**Frontend (index.html):**
- React app with all the Artemis UI
- Stores sessions/logs in browser localStorage
- Calls `/api/claude` instead of Claude API directly

**Backend (server.js):**
- Express server that proxies requests
- Takes API key + messages from frontend
- Forwards to Claude API
- Returns response to frontend

**Why?**
- Browsers block direct API calls to external services (CORS)
- This server acts as a middleman to bypass that restriction

## Test User Instructions

Send test users this:

**To use Artemis Mind prototype:**

1. Go to: [YOUR_DEPLOYED_URL]
2. Get a Claude API key from console.anthropic.com
   - Free tier gives $5 credit (~50-100 sessions)
3. Enter your API key when prompted
4. Start thinking!

**Privacy:**
- Your conversations are stored only in YOUR browser
- Your API key stays on YOUR device
- The server just forwards requests (doesn't store anything)

## Environment Variables

None required! Users provide their own API keys through the UI.

## Cost

**For you (hosting the server):**
- Render free tier: $0/month
- Railway free tier: $5/month credit
- Heroku: ~$7/month

**For test users:**
- Claude API costs (they pay with their own keys)
- ~$0.02-0.10 per session

## Development

```bash
# Install dependencies
npm install

# Run with auto-reload
npm run dev

# Production
npm start
```

## Security Notes

- Users provide their own API keys (never stored on server)
- API keys sent in request body (not logged)
- Server is stateless (doesn't store user data)
- All sessions stored in browser localStorage

## Troubleshooting

**"Load failed" error:**
- Check console for specific error
- Verify API key is valid
- Check backend logs on hosting platform

**CORS still happening:**
- Make sure you're accessing via the deployed URL
- Not opening index.html as a local file

**Backend not starting:**
- Run `npm install` first
- Check Node version (needs 14+)
- Check port 3001 isn't in use

## Next Steps After Testing

Based on test feedback:
- Add Atlas integration (Google Docs API)
- Build Prometheus vision flow
- Add Apollo project builder
- Create mobile app version
- Add authentication if needed
