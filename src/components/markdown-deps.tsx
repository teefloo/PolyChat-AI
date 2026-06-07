import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface MarkdownOptions {
  children: string;
}

export function MarkdownImpl({ children }: MarkdownOptions) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
  );
}
