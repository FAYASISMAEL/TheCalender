# Deployment Guide - Shared Events on Vercel

## ✅ Current Setup

Your application is now configured to share events across all users via a Vercel serverless API.

### How It Works

1. **API Endpoint**: `/api/events` - Vercel serverless function
2. **Storage**: In-memory storage (shared across all users on your Vercel deployment)
3. **Auto-sync**: Events sync every 5 seconds automatically
4. **Offline Support**: Uses localStorage as cache/fallback

### What's Been Implemented

- ✅ Vercel API route at `/api/events`
- ✅ EventsContext updated to fetch from API
- ✅ Auto-sync every 5 seconds
- ✅ Optimistic UI updates
- ✅ Error handling and fallbacks

## 🚀 Deployment Steps

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "feat: Add API backend for shared events across users"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)

3. **Test the deployment**:
   - Visit: https://the-calender-rouge.vercel.app/
   - Add an event as admin
   - Open in a different browser/device
   - Events should appear within 5 seconds

## 📝 Important Notes

### Current Storage (In-Memory)
- ✅ Works immediately - no setup required
- ✅ Events shared across all users
- ⚠️ Events reset when serverless function restarts (rare, but possible)

### For Production (Recommended)

To ensure events persist permanently, set up JSONBin.io:

1. **Sign up**: https://jsonbin.io/ (free tier available)
2. **Create a bin** and get:
   - Bin ID
   - Master Key (API Key)
3. **Add to Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `JSONBIN_BIN_ID` = your bin ID
     - `JSONBIN_API_KEY` = your master key
4. **Redeploy** your application

The API will automatically use JSONBin.io if these variables are set.

## 🧪 Testing

1. **Test as Admin**:
   - Login: `Hope.org` / `Hope.org@2025`
   - Add an event
   - Should appear immediately

2. **Test as User**:
   - Open calendar in different browser/incognito
   - Events should appear within 5 seconds
   - No login required for viewing

3. **Test API directly**:
   - Visit: `https://the-calender-rouge.vercel.app/api/events`
   - Should return JSON array of events

## 🔧 Troubleshooting

**Events not syncing?**
- Check browser console for errors
- Verify API is accessible: `https://the-calender-rouge.vercel.app/api/events`
- Check Vercel function logs in dashboard

**API errors?**
- Check Vercel deployment logs
- Verify API route is deployed correctly
- Check CORS settings if accessing from different domain

## 📊 API Endpoints

- `GET /api/events` - Fetch all events
- `POST /api/events` - Add new event
- `PUT /api/events` - Update all events (bulk)
- `DELETE /api/events` - Delete specific event

All endpoints support CORS and work cross-origin.
