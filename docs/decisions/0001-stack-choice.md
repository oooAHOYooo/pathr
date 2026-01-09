# ADR-0001: Stack Choice

## Status
Accepted

## Context
We need to choose a tech stack optimized for fast MVP delivery (2-4 weeks) while maintaining quality and scalability.

## Decision
- **Mobile**: React Native (Expo)
- **Backend**: Supabase
- **Web**: Next.js (App Router)
- **Maps**: Mapbox

## Rationale

### React Native (Expo)
- Fast iteration with hot reload
- Built-in location APIs
- OTA updates for quick fixes
- Zero native code needed for MVP
- Single codebase for iOS/Android

### Supabase
- Auth, database, storage, and edge functions in one platform
- PostGIS support for geospatial queries
- Free tier covers MVP needs
- Faster than building Flask backend from scratch (saves 4-5 weeks)

### Next.js
- Same language as mobile (TypeScript/React)
- Shares types and utilities
- Fast development with App Router
- Easy deployment on Vercel

### Mapbox
- Better offline support
- Custom styling matches liquid glass aesthetic
- Competitive pricing
- Excellent React Native SDK

## Consequences
- Positive: Fast MVP delivery, shared codebase, modern stack
- Negative: Vendor lock-in with Supabase (can migrate later if needed)
- Mitigation: Use Supabase for MVP, consider self-hosting at scale


