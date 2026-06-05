const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,0..100;1,9..144,300..900,0..100&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap";

const STORAGE_KEY = 'polychat-legal';
const FONTS_LINK_ID = 'polychat-google-fonts';

function readFontsConsent(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.state?.fontsConsent === true;
  } catch {
    return false;
  }
}

export function applyFontsConsent(granted: boolean): void {
  const existing = document.getElementById(FONTS_LINK_ID);
  if (granted && !existing) {
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    preconnect1.id = `${FONTS_LINK_ID}-preconnect-1`;
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    preconnect2.id = `${FONTS_LINK_ID}-preconnect-2`;
    document.head.appendChild(preconnect2);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_HREF;
    link.id = FONTS_LINK_ID;
    document.head.appendChild(link);
    document.documentElement.setAttribute('data-fonts', 'web');
  } else if (!granted && existing) {
    existing.remove();
    document.getElementById(`${FONTS_LINK_ID}-preconnect-1`)?.remove();
    document.getElementById(`${FONTS_LINK_ID}-preconnect-2`)?.remove();
    document.documentElement.setAttribute('data-fonts', 'system');
  }
}

export function initFontsConsent(): void {
  const granted = readFontsConsent();
  document.documentElement.setAttribute('data-fonts', granted ? 'web' : 'system');
  if (granted) applyFontsConsent(true);
}
