(() => {
  const sdk = window.__HERMES_PLUGINS__;
  if (!sdk) return console.warn('[PWA] Plugin SDK not found');

  function injectPwaManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;

    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/dashboard-plugins/hermes-pwa-support/pwa-manifest.json';
    document.head.appendChild(link);

    // Extra meta
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#000000';
    document.head.appendChild(meta);

    console.log('[PWA] Manifest injected successfully');
  }

  // Wait until the dashboard is fully loaded and user is authenticated
  const checkLoggedIn = setInterval(() => {
    // Look for any element that only appears after login (dashboard UI)
    if (document.querySelector('.dashboard, .main, [data-testid], nav, header')) {
      clearInterval(checkLoggedIn);
      injectPwaManifest();
    }
  }, 500);

  // Fallback: also try on full page load
  window.addEventListener('load', () => {
    if (document.querySelector('link[rel="manifest"]')) return;
    setTimeout(injectPwaManifest, 1500);
  });
})();