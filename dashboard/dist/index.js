(() => {
  const sdk = window.__HERMES_PLUGINS__;
  if (!sdk) return console.warn('[PWA] Plugin SDK not found');

  async function injectPwaManifest() {
    // Prevent duplicate injection
    if (document.querySelector('link[rel="manifest"]')) return;

    try {
      // Fetch from our backend API route (properly authenticated)
      const res = await fetch('/api/plugins/hermes-pwa-support/pwa-manifest', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        console.warn('[PWA] Manifest API returned', res.status);
        return;
      }

      const manifestData = await res.json();

      // Create a Blob URL so the browser never hits the static file path
      const blob = new Blob([JSON.stringify(manifestData, null, 2)], {
        type: 'application/manifest+json'
      });
      const blobUrl = URL.createObjectURL(blob);

      // Inject the manifest link using the Blob URL
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = blobUrl;
      document.head.appendChild(link);

      // iOS / Safari icons (still use static paths - they work after login)
      const apple180 = document.createElement('link');
      apple180.rel = 'apple-touch-icon';
      apple180.href = '/dashboard-plugins/hermes-pwa-support/icons/icon-192.png';
      document.head.appendChild(apple180);

      const apple512 = document.createElement('link');
      apple512.rel = 'apple-touch-icon';
      apple512.sizes = '512x512';
      apple512.href = '/dashboard-plugins/hermes-pwa-support/icons/icon-512.png';
      document.head.appendChild(apple512);

      // Theme color
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#000000';
      document.head.appendChild(meta);

      console.log('[PWA] Manifest + iOS icons injected successfully (via Blob URL)');
    } catch (e) {
      console.warn('[PWA] Could not inject manifest yet:', e.message);
    }
  }

  // Keep retrying until we succeed (max ~15 seconds)
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (attempts > 30) {
      clearInterval(interval);
      return;
    }
    injectPwaManifest();
  }, 500);

  // Also try once the page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(injectPwaManifest, 1500);
  });
})();