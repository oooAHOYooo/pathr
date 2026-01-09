export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-from/20 via-primary-light/10 to-accent-to/20 animate-pulse" />
      
      {/* Floating glass orbs for depth */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-accent-from/30 to-accent-to/30 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-primary-light/20 to-accent-to/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '6s' }} />
      
      {/* Main content card with liquid glass effect */}
      <div className="relative z-10 glass-medium rounded-glass-lg p-12 shadow-glass-large backdrop-blur-glass-medium border border-white/20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accent-from via-primary-light to-accent-to bg-clip-text text-transparent mb-2">
            Pathr
          </h1>
          <p className="text-lg md:text-xl text-text-secondary-light dark:text-text-secondary-dark">
            Like Strava for driving
          </p>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark max-w-md">
            Record your trips, discover scenic routes, and build a personal map of everywhere you've been.
          </p>
          
          {/* Action buttons with glass effect */}
          <div className="flex gap-4 justify-center mt-8">
            <button className="px-8 py-4 rounded-glass-md glass-medium shadow-glass hover:shadow-glass-medium transition-all duration-300 hover:scale-105 border border-white/20 font-medium">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-glass-md gradient-accent text-white shadow-glow-accent hover:shadow-glow-primary transition-all duration-300 hover:scale-105 font-medium">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative glass elements */}
      <div className="absolute top-10 right-10 w-32 h-32 glass rounded-glass-md shadow-glass opacity-60" />
      <div className="absolute bottom-10 left-10 w-24 h-24 glass rounded-glass-md shadow-glass opacity-40" />
    </main>
  );
}

