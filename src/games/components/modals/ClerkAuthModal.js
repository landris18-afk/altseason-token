import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/nextjs';

/**
 * ClerkAuthModal - Clerk bejelentkezés modal
 * 
 * @param {Object} props - Props objektum
 * @param {boolean} props.isOpen - Modal nyitva van-e
 * @param {Function} props.onClose - Modal bezárása
 * @param {Function} props.onPlayWithoutAuth - Játék bejelentkezés nélkül
 * @returns {JSX.Element} Clerk bejelentkezés modal
 */
const ClerkAuthModal = ({ isOpen, onClose, onPlayWithoutAuth }) => {
  const [showClerkAuth, setShowClerkAuth] = useState(false);
  
  if (!isOpen) return null;

  // Ha a Clerk auth megnyílt, azt jelenítsük meg
  if (showClerkAuth) {
    return (
      <>
        {/* Desktop: Modal popup */}
        <div className="hidden md:flex fixed inset-0 bg-black/80 backdrop-blur-sm items-center justify-center z-[10005] p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-yellow-400/20">
              <h2 className="text-xl font-bold text-white">Sign In</h2>
              <button
                onClick={() => setShowClerkAuth(false)}
                className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/70 text-gray-400 hover:text-white transition-all duration-200 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-yellow-400/30 hover:border-yellow-400/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Clerk Auth */}
            <div className="p-6">
              <SignIn 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none border-none",
                    headerTitle: "text-white",
                    headerSubtitle: "text-gray-300",
                    socialButtonsBlockButton: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600",
                    formButtonPrimary: "bg-yellow-500 hover:bg-yellow-600 text-black font-bold",
                    footerActionLink: "text-yellow-400 hover:text-yellow-300"
                  }
                }}
                afterSignInUrl="/game"
              />
            </div>
          </div>
        </div>

        {/* Mobile: Simple modal popup */}
        <div className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10005] p-4">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowClerkAuth(false)}
              className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200 rounded-full flex items-center justify-center border border-yellow-400/60 hover:border-yellow-400/80"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Sign In Box */}
            <SignIn 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-300",
                  socialButtonsBlockButton: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600",
                  formButtonPrimary: "bg-yellow-500 hover:bg-yellow-600 text-black font-bold",
                  footerActionLink: "text-yellow-400 hover:text-yellow-300"
                }
              }}
              afterSignInUrl="/game"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop: Modal popup */}
      <div className="hidden md:flex fixed inset-0 bg-black/80 backdrop-blur-sm items-center justify-center z-[10005] p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500/30 rounded-3xl shadow-2xl shadow-yellow-500/20 w-full max-w-4xl max-h-[80vh] overflow-hidden">
          {/* Content */}
          <div className="p-6">
            {/* Two Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Panel - Sign In / Sign Up */}
              <div className="group relative">
                <div className="relative border-2 border-blue-400/60 rounded-2xl p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm group-hover:border-blue-400/80 transition-all duration-300">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-blue-400 text-center mb-4">Sign In / Sign Up</h3>
                  
                  {/* Benefits */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">Progress saved across devices</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">Compete on the leaderboard</span>
                    </div>
                  </div>
                  
                  {/* Button */}
                  <button
                    onClick={() => setShowClerkAuth(true)}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              </div>

              {/* Right Panel - Play Without Account */}
              <div className="group relative">
                <div className="relative border-2 border-purple-400/60 rounded-2xl p-6 bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm group-hover:border-purple-400/80 transition-all duration-300">
                  {/* Close button - overlapping purple panel corner */}
                  <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-gray-800/90 hover:bg-gray-700/90 text-gray-400 hover:text-white transition-all duration-200 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-yellow-400/60 hover:border-yellow-400/80 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-purple-400 text-center mb-4">Play Without Account</h3>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">Transfer browser progress later</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">Only works on one device</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm">No leaderboard</span>
                    </div>
                  </div>
                  
                  {/* Button */}
                  <button
                    onClick={() => {
                      onPlayWithoutAuth();
                      onClose();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Full screen page */}
      <div className="md:hidden fixed inset-0 z-[10005]">
        <div 
          className="w-full h-full flex flex-col"
          style={{
            backgroundImage: 'url(/images/rockat_pump_bacground.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Header */}
          <div className="px-4 py-4 bg-gray-900/98 border-b border-yellow-400">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Join the Bull Run!</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-gray-700/80 hover:bg-gray-600/90 text-gray-300 hover:text-white transition-all duration-200 rounded-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Sign In / Sign Up Card */}
            <div className="mx-4 mt-6 mb-4 bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Sign In / Sign Up</h3>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="px-6 py-4">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">Progress saved across devices</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">Compete on the leaderboard</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowClerkAuth(true)}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 active:scale-95"
                >
                  Sign In / Sign Up
                </button>
              </div>
            </div>

            {/* Play Without Account Card */}
            <div className="mx-4 mb-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-b border-purple-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Play Without Account</h3>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="px-6 py-4">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-sm">Transfer browser progress later</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">Only works on one device</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-sm">No leaderboard</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    onPlayWithoutAuth();
                    onClose();
                  }}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium transition-all duration-200 active:scale-95"
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClerkAuthModal;