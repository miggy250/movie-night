import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import DonationModal from './DonationModal';

export default function SimpleDonateButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('SimpleDonateButton rendered!');

  return (
    <>
      {/* Simple sticky button - always visible */}
      <div className="fixed top-28 right-8 z-[120]">
        <motion.button
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-full shadow-2xl hover:bg-red-700 transition-all duration-300 flex items-center gap-2 border-2 border-red-500"
        >
          <Heart className="w-5 h-5" />
          Donate
        </motion.button>
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
