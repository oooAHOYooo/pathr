-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  distance_meters NUMERIC(10,2),
  duration_seconds INTEGER,
  avg_speed_kmh NUMERIC(5,2),
  max_speed_kmh NUMERIC(5,2),
  elevation_gain_meters NUMERIC(7,2),
  scenic_score INTEGER CHECK (scenic_score BETWEEN 0 AND 100),
  is_private BOOLEAN DEFAULT TRUE,
  share_token TEXT UNIQUE,
  polyline_simplified TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Trip Points table (raw GPS samples)
CREATE TABLE IF NOT EXISTS trip_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  latitude NUMERIC(10,8) NOT NULL,
  longitude NUMERIC(11,8) NOT NULL,
  altitude NUMERIC(7,2),
  accuracy_meters NUMERIC(5,2),
  speed_ms NUMERIC(5,2),
  heading_degrees NUMERIC(5,2),
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trip Stats table (precomputed aggregates)
CREATE TABLE IF NOT EXISTS trip_stats (
  trip_id UUID PRIMARY KEY REFERENCES trips(id) ON DELETE CASCADE,
  total_points INTEGER,
  simplified_points INTEGER,
  bounding_box BOX,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync Queue table (offline trip uploads)
CREATE TABLE IF NOT EXISTS sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trip_data JSONB NOT NULL,
  retry_count INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_created ON trips(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON trips(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trip_points_trip_timestamp ON trip_points(trip_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_trip_points_location ON trip_points USING GIST(
  ST_MakePoint(longitude, latitude)
);
CREATE INDEX IF NOT EXISTS idx_sync_queue_user ON sync_queue(user_id, created_at);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trips: Users can manage their own trips
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id OR (NOT is_private AND share_token IS NOT NULL));

CREATE POLICY "Users can insert own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- Trip Points: Users can manage points for their own trips
CREATE POLICY "Users can view own trip points" ON trip_points
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_points.trip_id
      AND (trips.user_id = auth.uid() OR (NOT trips.is_private AND trips.share_token IS NOT NULL))
    )
  );

CREATE POLICY "Users can insert own trip points" ON trip_points
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = trip_points.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Sync Queue: Users can manage their own queue items
CREATE POLICY "Users can manage own sync queue" ON sync_queue
  FOR ALL USING (auth.uid() = user_id);



