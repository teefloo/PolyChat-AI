let preloadStarted = false;

export function preloadMarkdown(): void {
  if (preloadStarted) return;
  preloadStarted = true;
  void import('./markdown-deps');
}
