import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Loader2, Play, Wifi, WifiOff } from 'lucide-react';

interface VideoLoadingBannerProps {
  isLoading: boolean;
  message?: string;
  showConnectionStatus?: boolean;
}

export default function VideoLoadingBanner({ 
  isLoading, 
  message = "Loading video player...",
  showConnectionStatus = true 
}: VideoLoadingBannerProps) {
  const [connectionStatus, setConnectionStatus] = useState<'good' | 'poor' | 'checking'>('checking');

  useEffect(() => {
    if (!showConnectionStatus) return;

    // Simple connection check
    const checkConnection = () => {
      const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;
      
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === '4g' || effectiveType === '3g') {
          setConnectionStatus('good');
        } else {
          setConnectionStatus('poor');
        }
      } else {
        // Fallback: check if we can load a small resource
        const img = new Image();
        const startTime = Date.now();
        img.onload = () => {
          const loadTime = Date.now() - startTime;
          setConnectionStatus(loadTime < 1000 ? 'good' : 'poor');
        };
        img.onerror = () => setConnectionStatus('poor');
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, [showConnectionStatus]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
    >
      {/* Loading Animation */}
      <div className="flex flex-col items-center space-y-6">
        {/* Main Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-full border-4 border-red-600/20 border-t-red-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-6 h-6 text-red-600" />
          </div>
        </motion.div>

        {/* Loading Messages */}
        <div className="text-center space-y-2">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white text-lg font-medium"
          >
            {message}
          </motion.h3>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm max-w-md"
          >
            Preparing your movie experience...
          </motion.p>
        </div>

        {/* Connection Status */}
        {showConnectionStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-full backdrop-blur-sm"
          >
            {connectionStatus === 'checking' ? (
              <>
                <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
                <span className="text-gray-400 text-xs">Checking connection...</span>
              </>
            ) : connectionStatus === 'good' ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-green-400 text-xs">Good connection</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-400 text-xs">Slow connection detected</span>
              </>
            )}
          </motion.div>
        )}

        {/* Progress Indicators */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 0.5,
                duration: 0.8
              }}
              className="w-2 h-2 rounded-full bg-red-600"
            />
          ))}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-1 max-w-sm"
        >
          <p className="text-gray-500 text-xs">
            💡 Tip: The video player will appear automatically
          </p>
          <p className="text-gray-600 text-xs">
            Press ESC to close anytime
          </p>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
    </motion.div>
  );
}
