const CACHE_NAME = 'fit-genie-v1.0.0';
const API_CACHE_NAME = 'fit-genie-api-v1.0.0';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico'
];

// API routes to cache
const API_ROUTES = [
  '/api/wardrobe',
  '/api/outfits', 
  '/api/weather',
  '/api/recommendations',
  '/api/analytics'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          // Try network first
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            // Cache successful responses
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // Fall back to cache if network fails
          console.log('[SW] Network failed, trying cache for:', url.pathname);
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Return offline fallback for specific routes
          if (url.pathname === '/api/weather') {
            return new Response(JSON.stringify({
              temperature: 20,
              condition: 'Unknown',
              location: 'Offline Mode',
              offline: true
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Generic offline response
          return new Response(JSON.stringify({
            error: 'Offline - cached data not available',
            offline: true
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: just fetch
  event.respondWith(fetch(request));
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);
  
  if (event.tag === 'outfit-save') {
    event.waitUntil(syncOutfitSaves());
  } else if (event.tag === 'photo-upload') {
    event.waitUntil(syncPhotoUploads());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: 'You have new outfit suggestions!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'fit-genie-notification',
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Suggestions'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data.url = data.url || options.data.url;
  }

  event.waitUntil(
    self.registration.showNotification('Fit Genie', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Helper functions for background sync
async function syncOutfitSaves() {
  try {
    // Get pending outfit saves from IndexedDB
    console.log('[SW] Syncing outfit saves...');
    // Implementation would sync offline saved outfits
  } catch (error) {
    console.error('[SW] Error syncing outfit saves:', error);
  }
}

async function syncPhotoUploads() {
  try {
    // Get pending photo uploads from IndexedDB
    console.log('[SW] Syncing photo uploads...');
    // Implementation would sync offline photo uploads
  } catch (error) {
    console.error('[SW] Error syncing photo uploads:', error);
  }
}

// Message handling from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] Service worker script loaded');