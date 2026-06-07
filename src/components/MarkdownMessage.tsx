import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import type { MarkdownOptions } from './markdown-deps';
import { preloadMarkdown } from './markdownPreload';

interface MarkdownMessageProps {
  content: string;
}

const MarkdownImpl = lazy<ComponentType<MarkdownOptions>>(() =>
  import('./markdown-deps').then((m) => ({ default: m.MarkdownImpl }))
);

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  useEffect(() => {
    preloadMarkdown();
  }, []);

  return (
    <Suspense fallback={<>{content}</>}>
      <MarkdownImpl>{content}</MarkdownImpl>
    </Suspense>
  );
}
