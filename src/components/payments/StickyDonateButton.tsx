import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X, Sparkles } from 'lucide-react';
import DonationModal from './DonationModal';

export default function StickyDonateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button immediately for testing
    setIsVisible(true);

    // Show tooltip periodically
    const tooltipTimer = setInterval(() => {
      if (!isMinimized && isVisible) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      }
    }, 30000);

    return () => {
      clearInterval(tooltipTimer);
    };
  }, [isMinimized, isVisible]);

  const handleMinimize = () => {
    setIsMinimized(true);
    setTimeout(() => setShowTooltip(false), 500);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: isMinimized ? 0.8 : 1
            }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-6 z-[110] lg:block"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && !isMinimized && (
                <motion.div
                  initial={{ opacity: 0, y: -10, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, y: -10, x: 20 }}
                  className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>Support Movie Night!</span>
                  </div>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {!isMinimized ? (
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center gap-2"
                >
                  <Heart className="w-5 h-5 group-hover:animate-pulse" />
                  <span className="hidden xl:inline">Support Us</span>
                  <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-180 transition-transform duration-500" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-red-600/20 blur-lg group-hover:bg-red-600/40 transition-colors" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleExpand}
                  className="w-12 h-12 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
              )}

              {/* Minimize Button */}
              {!isMinimized && (
                <button
                  onClick={handleMinimize}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Pulsing animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-400"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Version */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 right-4 z-[110] lg:hidden"
          >
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Heart className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
