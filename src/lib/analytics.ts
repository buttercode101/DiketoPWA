export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Placeholder for Vercel Analytics / Google Analytics
  if (process.env.NODE_ENV === 'production') {
    console.log(`[Analytics] Track Event: ${eventName}`, properties);
    // window.va?.track(eventName, properties);
    // window.gtag?.('event', eventName, properties);
  } else {
    console.log(`[Analytics-Dev] Track Event: ${eventName}`, properties);
  }
};

export const trackPageView = (url: string) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[Analytics] Page View: ${url}`);
  }
};
