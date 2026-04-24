import { motion } from 'motion/react';
import { Heart, Star, Sparkles, Share2, Download } from 'lucide-react';

interface DonationSuccessProps {
  tierName: string;
  amount: number;
  onClose: () => void;
}

export default function DonationSuccess({ tierName, amount, onClose }: DonationSuccessProps) {
  const shareText = `I just donated $${amount} to Movie Night to help keep movies free for everyone! Support independent cinema 🎬❤️`;
  const shareUrl = window.location.href;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I supported Movie Night!',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-gray-900 rounded-2xl max-w-md w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Heart className="w-10 h-10 text-white" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Thank You!</h2>
          <p className="text-gray-300 mb-6">
            Your {tierName} donation of <span className="text-red-500 font-bold">${amount}</span> helps keep Movie Night free for everyone!
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-4 mb-6"
        >
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            Your Benefits
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
              Ad-free experience
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
              HD streaming quality
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-red-500 rounded-full" />
              Support independent cinema
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={handleShare}
            className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Your Support
          </button>
          
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Continue Watching
          </button>
        </motion.div>

        {/* Impact Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-500 mt-6"
        >
          <Heart className="w-3 h-3 inline mr-1" />
          Your contribution helps us maintain servers and acquire new movies
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
