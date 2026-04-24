import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import DonationModal from './DonationModal';

interface DonationButtonProps {
  className?: string;
  variant?: 'header' | 'floating' | 'inline';
  movieTitle?: string;
}

export default function DonationButton({ 
  className = '', 
  variant = 'header',
  movieTitle 
}: DonationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonStyles = {
    header: 'px-4 py-2 bg-red-600/20 border border-red-600 text-red-500 hover:bg-red-600/30',
    floating: 'w-14 h-14 bg-red-600 rounded-full shadow-lg hover:bg-red-700 hover:scale-110',
    inline: 'px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800'
  };

  const buttonContent = {
    header: (
      <>
        <Heart className="w-4 h-4" />
        <span>Support Us</span>
      </>
    ),
    floating: <Heart className="w-6 h-6 text-white" />,
    inline: (
      <>
        <Heart className="w-5 h-5" />
        <span>Support Movie Night</span>
        <Sparkles className="w-4 h-4" />
      </>
    )
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center justify-center gap-2 font-medium transition-all ${buttonStyles[variant]} ${className}`}
      >
        {buttonContent[variant]}
      </motion.button>

      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieTitle={movieTitle}
      />
    </>
  );
}
