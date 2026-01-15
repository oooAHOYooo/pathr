# 🚀 Deploying Pathr to Render

## Quick Deploy

Pathr is now ready to deploy to Render! The MVP uses:
- ✅ **localStorage** for trip storage (no database needed)
- ✅ **Leaflet/OpenStreetMap** (free, no API keys needed)
- ✅ **Browser geolocation** (works on HTTPS)

## Render Setup

### 1. Connect Your Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub/GitLab repository
4. Select the `pathr` repository

### 2. Configure Build Settings

**Build Command:**
```bash
cd apps/web && pnpm install && pnpm build
```

**Start Command:**
```bash
cd apps/web && pnpm start
```

**Root Directory:** (leave empty, or set to `apps/web` if Render supports it)

### 3. Environment Variables

**None needed!** The MVP works without any environment variables.

(Optional: If you want to add Supabase later, you can add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 4. Deploy

Click "Create Web Service" and Render will:
- Install dependencies
- Build the Next.js app
- Deploy it

## Important Notes

### HTTPS Required for Geolocation

- ✅ Render provides HTTPS by default
- ✅ Browser geolocation API requires HTTPS (or localhost)
- ✅ Your app will work perfectly on Render!

### localStorage Limitations

- ⚠️ Data is stored in browser (not synced across devices)
- ⚠️ Data is lost if user clears browser data
- ✅ Perfect for MVP testing
- ✅ Can add Supabase later for sync

### Next Steps After Deploy

1. Test trip recording on your phone (HTTPS required)
2. Drive home and record a trip
3. View trips on the `/trips` page
4. Share feedback!

## Troubleshooting

### Build Fails

Check that:
- Node.js version is 20+ (Render auto-detects)
- `pnpm` is available (add to build command if needed)

### Geolocation Not Working

- Must be on HTTPS (Render provides this)
- User must grant location permission
- Works best on mobile devices

### Map Not Loading

- Check browser console for errors
- OpenStreetMap tiles are free but rate-limited
- Consider Mapbox if you need higher limits

## Cost

**Free tier on Render:**
- ✅ 750 hours/month free
- ✅ Automatic SSL/HTTPS
- ✅ Perfect for MVP!

---

**Ready to deploy?** Just connect your repo and click deploy! 🚀
