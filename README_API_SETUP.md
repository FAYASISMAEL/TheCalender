# API Setup for Shared Events

## Current Implementation

The application now uses a Vercel serverless function at `/api/events` to share events across all users.

## How It Works

1. **API Endpoint**: `/api/events` handles all event operations
2. **Storage**: Currently uses in-memory storage (shared across all users on Vercel)
3. **Auto-sync**: Events sync every 5 seconds automatically
4. **Fallback**: Uses localStorage as cache/fallback if API fails

## Setup Instructions

### Option 1: Use Current Implementation (In-Memory)
- Works immediately on Vercel
- Events are shared across all users
- Note: Events reset when serverless function restarts (rare)

### Option 2: Use JSONBin.io for Persistent Storage (Recommended)

1. **Sign up for JSONBin.io** (free tier available):
   - Go to https://jsonbin.io/
   - Create a free account
   - Create a new bin

2. **Get your credentials**:
   - Copy your Bin ID
   - Copy your API Key (Master Key)

3. **Add environment variables in Vercel**:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add:
     - `JSONBIN_BIN_ID` = your bin ID
     - `JSONBIN_API_KEY` = your master key

4. **Redeploy** your application

### Option 3: Use a Database (For Production)

For production use, consider:
- **Supabase** (free tier)
- **MongoDB Atlas** (free tier)
- **Firebase Realtime Database** (free tier)

## API Endpoints

- `GET /api/events` - Fetch all events
- `POST /api/events` - Add a new event
- `PUT /api/events` - Update all events
- `DELETE /api/events` - Delete an event

## Testing

After deployment, test the API:
1. Add an event as admin
2. Open the calendar in a different browser/device
3. Events should appear within 5 seconds

## Troubleshooting

If events aren't syncing:
1. Check browser console for errors
2. Verify API endpoint is accessible: `https://the-calender-rouge.vercel.app/api/events`
3. Check Vercel function logs in dashboard
