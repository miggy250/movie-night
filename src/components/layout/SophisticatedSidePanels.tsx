import { motion, AnimatePresence } from 'motion/react';
import { Clapperboard, Clock3, Heart, PlayCircle } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useContinueWatching } from '../../contexts/ContinueWatchingContext';
import { useMediaLibrary } from '../../contexts/MediaLibraryContext';

interface SophisticatedSidePanelsProps {
  navigateTo?: (path: string) => void;
}

export default function SophisticatedSidePanels({ navigateTo }: SophisticatedSidePanelsProps = {}) {
  const [hoveredButton, setHoveredButton] = useState<'liked' | 'continue' | 'queue' | 'trailers' | null>(null);
  const { likedItems, queuedItems } = useMediaLibrary();
  const { entries } = useContinueWatching();

  const handleNavigate = (path: string) => {
    if (navigateTo) {
      navigateTo(path);
      return;
    }

    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="fixed right-2 top-1/2 z-40 -translate-y-1/2">
      <div className="relative flex items-center">
        <div className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/55 p-1 shadow-2xl shadow-black/25 backdrop-blur-xl sm:gap-1.5 sm:p-1.5">
          <ShortcutButton
            badgeCount={likedItems.length}
            colorClass="hover:bg-red-600/80"
            hovered={hoveredButton === 'liked'}
            icon={<Heart className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />}
            label="Liked Titles"
            onBlur={() => setHoveredButton(null)}
            onClick={() => handleNavigate('/liked')}
            onFocus={() => setHoveredButton('liked')}
            onHoverEnd={() => setHoveredButton(null)}
            onHoverStart={() => setHoveredButton('liked')}
          />

          <ShortcutButton
            badgeCount={entries.length}
            colorClass="hover:bg-sky-600/80"
            hovered={hoveredButton === 'continue'}
            icon={<PlayCircle className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />}
            label="Continue Watching"
            onBlur={() => setHoveredButton(null)}
            onClick={() => handleNavigate('/continue-watching')}
            onFocus={() => setHoveredButton('continue')}
            onHoverEnd={() => setHoveredButton(null)}
            onHoverStart={() => setHoveredButton('continue')}
          />

          <ShortcutButton
            badgeCount={queuedItems.length}
            colorClass="hover:bg-green-600/80"
            hovered={hoveredButton === 'queue'}
            icon={<Clock3 className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />}
            label="My Queue"
            onBlur={() => setHoveredButton(null)}
            onClick={() => handleNavigate('/queue')}
            onFocus={() => setHoveredButton('queue')}
            onHoverEnd={() => setHoveredButton(null)}
            onHoverStart={() => setHoveredButton('queue')}
          />

          <ShortcutButton
            colorClass="hover:bg-orange-600/80"
            hovered={hoveredButton === 'trailers'}
            icon={<Clapperboard className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />}
            label="Trailers"
            onBlur={() => setHoveredButton(null)}
            onClick={() => handleNavigate('/trailers')}
            onFocus={() => setHoveredButton('trailers')}
            onHoverEnd={() => setHoveredButton(null)}
            onHoverStart={() => setHoveredButton('trailers')}
          />
        </div>
      </div>
    </div>
  );
}

interface ShortcutButtonProps {
  badgeCount?: number;
  colorClass: string;
  hovered: boolean;
  icon: ReactNode;
  label: string;
  onBlur: () => void;
  onClick: () => void;
  onFocus: () => void;
  onHoverEnd: () => void;
  onHoverStart: () => void;
}

function ShortcutButton({
  badgeCount = 0,
  colorClass,
  hovered,
  icon,
  label,
  onBlur,
  onClick,
  onFocus,
  onHoverEnd,
  onHoverStart,
}: ShortcutButtonProps) {
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-lg transition-all ${colorClass} sm:h-9 sm:w-9 lg:h-10 lg:w-10`}
        aria-label={label}
        title={label}
      >
        {icon}
        {badgeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black sm:h-4 sm:w-4">
            {badgeCount}
          </span>
        )}
      </motion.button>
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-10 top-1/2 hidden -translate-y-1/2 rounded-lg bg-white px-2 py-1 text-[11px] font-medium whitespace-nowrap text-black shadow-lg sm:block"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
