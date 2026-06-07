(() => {
  const sdk = window.__HERMES_PLUGINS__;
  if (!sdk) return console.warn('[PWA] Plugin SDK not found');

  async function injectPwaManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;

    try {
      // Verify the manifest is actually valid JSON before injecting
      const res = await fetch('/dashboard-plugins/hermes-pwa-support/pwa-manifest.json', {
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Manifest not ready');

      const data = await res.json();
      if (!data.name) throw new Error('Invalid manifest');

      // Safe to inject now
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/dashboard-plugins/hermes-pwa-support/pwa-manifest.json';
      document.head.appendChild(link);

      // iOS icons
      const apple180 = document.createElement('link');
      apple180.rel = 'apple-touch-icon';
      apple180.href = '/dashboard-plugins/hermes-pwa-support/icons/icon-192.png';
      document.head.appendChild(apple180);

      console.log('[PWA] Manifest + iOS icons injected successfully');
    } catch (e) {
      console.warn('[PWA] Manifest not ready yet, retrying...');
    }
  }

  // Aggressive retry until it works
  let attempts = 0;
  const interval = setInterval(() => {
    if (attempts++ > 30) return clearInterval(interval); // max 15 seconds
    injectPwaManifest();
  }, 500);

  // Also try on full load
  window.addEventListener('load', () => setTimeout(injectPwaManifest, 2000));
})();