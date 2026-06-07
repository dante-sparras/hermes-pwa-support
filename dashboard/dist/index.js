(() => {
  const sdk = window.__HERMES_PLUGINS__;
  if (!sdk) return console.warn('[PWA] Plugin SDK not found');

  function injectPwaManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;

    // PWA manifest
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/dashboard-plugins/hermes-pwa-support/pwa-manifest.json';
    document.head.appendChild(link);

    // iOS / Apple specific icons
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

    console.log('[PWA] Manifest + iOS icons injected');
  }

  // Wait until logged in
  const checkLoggedIn = setInterval(() => {
    if (document.querySelector('.dashboard, .main, nav, header')) {
      clearInterval(checkLoggedIn);
      injectPwaManifest();
    }
  }, 500);

  window.addEventListener('load', () => setTimeout(injectPwaManifest, 2000));
})();