/**
 * Haptic Feedback Utility
 * Provides vibration patterns for different game events
 * Works on Android devices that support the Vibration API
 */

export type HapticPattern = number | number[];

export const HAPTIC_PATTERNS = {
  // Light feedback
  light: 10,
  medium: 20,
  strong: [30, 50, 30],
  
  // Game events
  select: 15,
  move: 20,
  place: 25,
  capture: [40, 60, 40],
  mill: [50, 70, 50, 70, 50],
  victory: [100, 80, 100, 80, 100],
  error: [30, 50, 30, 50, 30],
  
  // UI feedback
  click: 10,
  hover: 5,
  notification: [20, 40, 20],
};

/**
 * Trigger haptic feedback
 * @param pattern - Vibration pattern (number or array)
 * @returns boolean - Whether vibration was triggered
 */
export const vibrate = (pattern: HapticPattern): boolean => {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return false;
  }
  
  try {
    navigator.vibrate(pattern);
    return true;
  } catch (error) {
    // iOS doesn't support vibrate API
    return false;
  }
};

/**
 * Trigger haptic feedback for game events
 */
export const hapticFeedback = {
  select: () => vibrate(HAPTIC_PATTERNS.select),
  move: () => vibrate(HAPTIC_PATTERNS.move),
  place: () => vibrate(HAPTIC_PATTERNS.place),
  capture: () => vibrate(HAPTIC_PATTERNS.capture),
  mill: () => vibrate(HAPTIC_PATTERNS.mill),
  victory: () => vibrate(HAPTIC_PATTERNS.victory),
  error: () => vibrate(HAPTIC_PATTERNS.error),
  click: () => vibrate(HAPTIC_PATTERNS.click),
  notification: () => vibrate(HAPTIC_PATTERNS.notification),
};

/**
 * Check if device supports haptic feedback
 */
export const supportsHaptics = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};
