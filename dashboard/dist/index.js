(() => {
  const sdk = window.__HERMES_PLUGINS__;
  if (!sdk) return console.warn('[PWA] Plugin SDK not found');

  function injectManifest() {
    if (document.querySelector('link[rel="manifest"]')) return;
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/dashboard-plugins/hermes-pwa-support/pwa-manifest.json';
    document.head.appendChild(link);

    // Extra PWA metas
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#000000';
    document.head.appendChild(meta);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectManifest);
  } else {
    injectManifest();
  }
})();