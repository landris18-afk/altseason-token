import { useState } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(true);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-yellow-500/30 shadow-lg shadow-yellow-500/20 z-50 animate-fade-in-up">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-300 text-sm sm:text-base">
            <p>This game uses local storage to save your game progress. This is necessary for the game to function properly. No tracking or analytics cookies are used.</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={acceptCookies}
              className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-all text-sm"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 