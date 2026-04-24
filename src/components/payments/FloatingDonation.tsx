import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Sparkles } from 'lucide-react';
import DonationButton from './DonationButton';

export default function FloatingDonation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show floating donation after 30 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleMinimize = () => {
    setIsMinimized(true);
    setTimeout(() => setShowTooltip(true), 500);
  };

  const handleExpand = () => {
    setIsMinimized(false);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: 1, 
            y: isMinimized ? 0 : -20,
            scale: isMinimized ? 0.8 : 1
          }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-40"
        >
          {!isMinimized ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 p-1 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>

              {/* Content */}
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Support Movie Night</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Help us keep movies free for everyone. Your support makes a difference!
                </p>
              </div>

              {/* Donation Options */}
              <div className="space-y-2 mb-4">
                <DonationButton variant="inline" className="w-full" />
                <button
                  onClick={handleMinimize}
                  className="w-full px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Maybe Later
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>Appreciated</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative"
            >
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap"
                  >
                    Support us!
                    <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Minimized Button */}
              <DonationButton variant="floating" />
              
              {/* Expand Button */}
              <button
                onClick={handleExpand}
                className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <span className="text-xs text-white">+</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
