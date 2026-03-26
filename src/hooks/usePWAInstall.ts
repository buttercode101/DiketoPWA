/**
 * PWA Install Prompt Hook
 * Handles custom install prompt UI for better conversion rates
 */

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptResult {
  outcome: 'accepted' | 'dismissed' | 'not-available';
  installed: boolean;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);
  const [lastDismissed, setLastDismissed] = useState<number | null>(null);

  // Check if app is already installed
  useEffect(() => {
    const checkInstalled = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isWindowControlsOverlay = window.matchMedia('(display-mode: window-controls-overlay)').matches;
      
      setIsInstalled(isStandalone || isWindowControlsOverlay);
    };
    
    checkInstalled();
    
    // Load dismiss count from localStorage
    const savedCount = localStorage.getItem('diketo-install-dismissed');
    const savedDate = localStorage.getItem('diketo-install-dismissed-date');
    
    if (savedCount) setDismissCount(parseInt(savedCount, 10));
    if (savedDate) setLastDismissed(parseInt(savedDate, 10));
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('[PWA] beforeinstallprompt event fired');
      
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      
      // Track install prompt shown
      trackInstallPromptShown();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully!');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      trackInstallSuccess();
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Check if we should show install prompt
  const shouldShowPrompt = useCallback(() => {
    // Don't show if already installed
    if (isInstalled) return false;
    
    // Don't show if not installable
    if (!isInstallable || !deferredPrompt) return false;
    
    // Don't show if dismissed more than 3 times
    if (dismissCount >= 3) return false;
    
    // Don't show if dismissed within last 7 days
    if (lastDismissed) {
      const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return false;
    }
    
    return true;
  }, [isInstalled, isInstallable, deferredPrompt, dismissCount, lastDismissed]);

  // Trigger install prompt
  const promptInstall = useCallback(async (): Promise<InstallPromptResult> => {
    if (!deferredPrompt) {
      return { outcome: 'not-available', installed: false };
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User choice:', outcome);
      
      if (outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        trackInstallSuccess();
        return { outcome: 'accepted', installed: true };
      } else {
        console.log('[PWA] User dismissed the install prompt');
        trackInstallDismissed();
        return { outcome: 'dismissed', installed: false };
      }
    } catch (error) {
      console.error('[PWA] Install prompt error:', error);
      return { outcome: 'dismissed', installed: false };
    }
  }, [deferredPrompt]);

  // Track install prompt shown
  const trackInstallPromptShown = () => {
    // Could send to analytics
    console.log('[PWA Analytics] Install prompt shown');
  };

  // Track install success
  const trackInstallSuccess = () => {
    localStorage.setItem('diketo-installed', 'true');
    // Could send to analytics
    console.log('[PWA Analytics] App installed');
  };

  // Track install dismissed
  const trackInstallDismissed = () => {
    const newCount = dismissCount + 1;
    setDismissCount(newCount);
    setLastDismissed(Date.now());
    
    localStorage.setItem('diketo-install-dismissed', newCount.toString());
    localStorage.setItem('diketo-install-dismissed-date', Date.now().toString());
    
    // Could send to analytics
    console.log('[PWA Analytics] Install dismissed', newCount);
  };

  // Reset dismiss count (for testing or after major update)
  const resetDismissCount = useCallback(() => {
    setDismissCount(0);
    setLastDismissed(null);
    localStorage.removeItem('diketo-install-dismissed');
    localStorage.removeItem('diketo-install-dismissed-date');
  }, []);

  // Get install prompt state
  const getInstallState = useCallback(() => ({
    isInstalled,
    isInstallable,
    shouldShow: shouldShowPrompt(),
    dismissCount,
    canPromptAgain: dismissCount < 3,
  }), [isInstalled, isInstallable, shouldShowPrompt, dismissCount]);

  return {
    // State
    isInstalled,
    isInstallable,
    deferredPrompt,
    dismissCount,
    
    // Actions
    promptInstall,
    shouldShowPrompt,
    resetDismissCount,
    
    // Getters
    getInstallState,
  };
};

// Helper to check if running as PWA
export const isPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    (window.navigator as any).standalone === true
  );
};

// Helper to check if PWA is installable
export const isPWAInstallable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // If already installed, not installable
  if (isPWA()) return false;
  
  // Check basic PWA requirements
  const hasManifest = !!document.querySelector('link[rel="manifest"]');
  const hasServiceWorker = 'serviceWorker' in navigator;
  const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  
  return hasManifest && hasServiceWorker && isHTTPS;
};
