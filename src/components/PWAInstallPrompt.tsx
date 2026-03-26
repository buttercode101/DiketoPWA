/**
 * PWA Install Prompt Component
 * Custom UI for better installation conversion rates
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Star, Smartphone, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallPrompt: React.FC = () => {
  const { promptInstall, shouldShowPrompt, isInstalled, dismissCount } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Show prompt after 10 seconds if conditions are met
    const timer = setTimeout(() => {
      if (shouldShowPrompt()) {
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [shouldShowPrompt]);

  const handleInstall = async () => {
    setIsInstalling(true);
    const result = await promptInstall();
    
    if (result.installed) {
      setIsVisible(false);
    } else {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[1000]"
        >
          <div className="bg-[#0A0502] border border-[#C8782A]/30 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[#C8782A] to-[#FFD700] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0A0502] rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🪨</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Install Diketo</h3>
                    <p className="text-white/80 text-xs">Play offline, anytime!</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#C8782A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone size={16} className="text-[#C8782A]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Play Anywhere</p>
                  <p className="text-white/60 text-xs">Works offline, no internet needed</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#C8782A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={16} className="text-[#C8782A]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Lightning Fast</p>
                  <p className="text-white/60 text-xs">Instant load, no waiting</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#C8782A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star size={16} className="text-[#C8782A]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Full Experience</p>
                  <p className="text-white/60 text-xs">All features, native-like feel</p>
                </div>
              </div>

              {/* Install button */}
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full py-3 bg-gradient-to-r from-[#C8782A] to-[#FFD700] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isInstalling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Install App
                  </>
                )}
              </button>

              {/* Dismiss text */}
              <p className="text-center text-[10px] text-white/40">
                {3 - dismissCount} reminders remaining • Can dismiss {3 - dismissCount} more times
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Simpler banner version for less intrusive prompting
export const PWAInstallBanner: React.FC = () => {
  const { promptInstall, shouldShowPrompt, isInstalled } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldShowPrompt()) {
        setIsVisible(true);
      }
    }, 30000); // Show after 30 seconds

    return () => clearTimeout(timer);
  }, [shouldShowPrompt]);

  const handleInstall = async () => {
    await promptInstall();
    setIsVisible(false);
  };

  if (isInstalled || !isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden"
    >
      <div className="bg-[#0A0502]/95 backdrop-blur-lg border-t border-[#C8782A]/30 p-4 pb-8 safe-area-pb">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-[#C8782A] to-[#FFD700] rounded-xl flex items-center justify-center">
              <span className="text-xl">🪨</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Install Diketo</p>
              <p className="text-white/60 text-xs">Play offline anytime</p>
            </div>
          </div>
          
          <button
            onClick={handleInstall}
            className="px-6 py-2.5 bg-gradient-to-r from-[#C8782A] to-[#FFD700] text-white font-bold rounded-full text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Download size={16} />
            Install
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PWAInstallPrompt;
