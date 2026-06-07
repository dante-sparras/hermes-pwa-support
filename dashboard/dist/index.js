(() => {
  const sdk = window.__HERMES_PLUGINS__;
  if (!sdk) return console.warn('[PWA] Plugin SDK not found');

  async function injectPwaManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;

    try {
      const res = await fetch('/api/plugins/hermes-pwa-support/pwa-manifest', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        console.warn('[PWA] Manifest API returned', res.status);
        return;
      }

      let manifestData = await res.json();

      // === Make it portable: rewrite URLs using the current origin ===
      const origin = window.location.origin;

      if (manifestData.start_url && manifestData.start_url.startsWith('/')) {
        manifestData.start_url = origin + manifestData.start_url;
      }

      if (manifestData.icons && Array.isArray(manifestData.icons)) {
        manifestData.icons = manifestData.icons.map(icon => {
          if (icon.src && icon.src.startsWith('/')) {
            icon.src = origin + icon.src;
          }
          return icon;
        });
      }

      // Create Blob from the rewritten manifest
      const blob = new Blob([JSON.stringify(manifestData, null, 2)], {
        type: 'application/manifest+json'
      });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = blobUrl;
      document.head.appendChild(link);

      // iOS icons (use full origin for safety)
      const apple180 = document.createElement('link');
      apple180.rel = 'apple-touch-icon';
      apple180.href = origin + '/dashboard-plugins/hermes-pwa-support/icons/icon-192.png';
      document.head.appendChild(apple180);

      const apple512 = document.createElement('link');
      apple512.rel = 'apple-touch-icon';
      apple512.sizes = '512x512';
      apple512.href = origin + '/dashboard-plugins/hermes-pwa-support/icons/icon-512.png';
      document.head.appendChild(apple512);

      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#000000';
      document.head.appendChild(meta);

      console.log('[PWA] Manifest + iOS icons injected successfully (portable, via Blob URL)');
    } catch (e) {
      console.warn('[PWA] Could not inject manifest yet:', e.message);
    }
  }

  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (attempts > 30) {
      clearInterval(interval);
      return;
    }
    injectPwaManifest();
  }, 500);

  window.addEventListener('load', () => {
    setTimeout(injectPwaManifest, 1500);
  });
})();