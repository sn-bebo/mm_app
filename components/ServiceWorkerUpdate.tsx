'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerUpdate() {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            setWaitingWorker(newWorker);
            setShowReload(true);
          }
        });
      });
    });

    // Check for updates every hour
    const interval = setInterval(() => {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleReload = () => {
    if (!waitingWorker) return;

    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    
    waitingWorker.addEventListener('statechange', (e) => {
      const sw = e.target as ServiceWorker;
      if (sw.state === 'activated') {
        window.location.reload();
      }
    });
  };

  if (!showReload) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-up">
      <div className="bg-blue-500 text-white rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔄</div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Update Available!</h3>
            <p className="text-sm text-blue-50 mb-3">
              A new version of the app is ready to install.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReload}
                className="flex-1 px-4 py-2 bg-white text-blue-500 rounded-lg hover:bg-blue-50 font-medium text-sm"
              >
                Reload Now
              </button>
              <button
                onClick={() => setShowReload(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
