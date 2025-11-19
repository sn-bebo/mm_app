import Header from '@/components/Header';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header title="About Us" showHomeButton={true} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              🌍 Your Travel Companion
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Built with passion by <span className="font-bold text-blue-600 dark:text-blue-400">Syed</span>, this app is designed to make your travels more organized and memorable.
            </p>
          </div>

          {/* Story Section */}
          <div className="border-t dark:border-gray-700 pt-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              What started as a personal project to keep track of my own adventures has grown into a full-featured travel companion that works offline, syncs your progress, and helps you discover amazing places.
            </p>
          </div>

          {/* Features Section */}
          <div className="border-t dark:border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ Features You'll Love
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-2xl">📍</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Organize Everything</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Places, food spots, and shopping destinations all in one place</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Integrated Maps</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Direct Google Maps integration for easy navigation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Track Progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time tracking of visited places and completion status</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <span className="text-2xl">🌙</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Beautiful Dark Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Easy on the eyes, any time of day</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-2xl">✈️</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Works Offline</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No internet? No problem! Access everything offline</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Install as App</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Works like a native app on your phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="border-t dark:border-gray-700 pt-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Made with ❤️ using <span className="font-semibold text-blue-600 dark:text-blue-400">Next.js</span>, <span className="font-semibold text-blue-600 dark:text-blue-400">TypeScript</span>, and modern web technologies.
            </p>
          </div>

          {/* Call to Action */}
          <div className="border-t dark:border-gray-700 pt-6 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Happy travels! 🎒
            </p>
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Start Exploring
            </Link>
          </div>

          {/* Version Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-500">
            <p>Version 1.0.0 • Built in 2025</p>
          </div>
        </div>
      </main>
    </div>
  );
}
