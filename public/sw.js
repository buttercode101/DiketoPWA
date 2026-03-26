/**
 * Diketo PWA Service Worker
 * Offline-first caching strategy with versioned caches
 * Implements Cache-First, Network-First, and Stale-While-Revalidate strategies
 */

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `diketo-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `diketo-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `diketo-images-${CACHE_VERSION}`;

// Critical assets to pre-cache during install
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - pre-cache critical assets
self.addEventListener('install', (event) => {
  console.log('[Diketo SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Diketo SW] Pre-caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('[Diketo SW] Installation complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Diketo SW] Pre-cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Diketo SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old versioned caches
              return cacheName.startsWith('diketo-') && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => {
              console.log('[Diketo SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[Diketo SW] Activation complete, claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Route requests to appropriate caching strategies
  if (isImageRequest(request)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
  } else if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  }
});

// Helper functions
function isImageRequest(request) {
  return request.destination === 'image' || 
         request.url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i);
}

function isAPIRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('api.') ||
         request.url.includes('gemini');
}

function isStaticAsset(request) {
  return request.url.match(/\.(js|css|woff|woff2|ttf|eot)$/i) ||
         request.url.includes('/assets/');
}

// Cache-First Strategy (for images and static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('[Diketo SW] Cache hit:', request.url);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Diketo SW] Network failed, returning offline placeholder');
    
    // Return offline placeholder for images
    if (cacheName === IMAGE_CACHE) {
      return new Response('', {
        status: 404,
        statusText: 'Offline - Image not available'
      });
    }
    
    // Return offline page for navigation
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Network-First Strategy (for API calls)
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Diketo SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[Diketo SW] Returning cached API response');
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(JSON.stringify({
      error: 'offline',
      message: 'You are offline. Some features may not be available.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale-While-Revalidate Strategy (for static assets)
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background and update cache
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Network failed, cached response will be used
      return null;
    });
  
  // Return cached response immediately, or wait for network
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Diketo SW] Sync event:', event.tag);
  
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  // Sync any offline game data when back online
  console.log('[Diketo SW] Syncing game data...');
  // Implementation depends on your data storage strategy
}

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  console.log('[Diketo SW] Push received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'play', title: 'Play Now' },
      { action: 'later', title: 'Later' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Diketo', options)
  );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('[Diketo SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLIENTS_CLAIM') {
    self.clients.claim();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});

console.log('[Diketo SW] Service worker loaded');
