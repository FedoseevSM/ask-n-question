import React from 'react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
interface MarkdownPreviewProps {
  frontmatter: any;
  content: string;
}
export function MarkdownPreview({
  frontmatter,
  content
}: MarkdownPreviewProps) {
  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    let html = text
    // Headers
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>'
    ).
    replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>'
    ).
    replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>'
    )
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // Links
    .replace(
      /\[(.*?)\]\((.*?)\)/gim,
      '<a href="$2" class="text-primary underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Code blocks
    .replace(
      /```([\s\S]*?)```/gim,
      '<pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>'
    )
    // Inline code
    .replace(
      /`([^`]+)`/gim,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>'
    )
    // Lists
    .replace(/^\s*-\s(.*)$/gim, '<li class="ml-4 list-disc">$1</li>')
    // Paragraphs (basic)
    .split('\n\n').
    map((p) => {
      if (
      p.trim().startsWith('<h') ||
      p.trim().startsWith('<pre') ||
      p.trim().startsWith('<li'))
      {
        return p;
      }
      return `<p class="mb-4 leading-relaxed">${p}</p>`;
    }).
    join('');
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: html
        }} />);


  };
  return (
    <div className="w-full h-full bg-background border rounded-md p-6 overflow-y-auto prose prose-sm max-w-none dark:prose-invert">
      {/* Frontmatter Preview */}
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {frontmatter.title || 'Без заголовка'}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {frontmatter.date &&
          <time dateTime={frontmatter.date}>
              {new Date(frontmatter.date).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            </time>
          }
          {frontmatter.author && <span>• {frontmatter.author}</span>}
          {frontmatter.readingTime &&
          <span>• {frontmatter.readingTime} мин. чтения</span>
          }
        </div>

        {frontmatter.draft && <Badge variant="destructive">Черновик</Badge>}

        {frontmatter.summary &&
        <p className="text-xl text-muted-foreground italic border-l-4 border-muted pl-4">
            {frontmatter.summary}
          </p>
        }

        {(frontmatter.tags?.length > 0 ||
        frontmatter.categories?.length > 0) &&
        <div className="flex flex-wrap gap-2 pt-2">
            {frontmatter.categories?.map((cat: string) =>
          <Badge key={cat} variant="default">
                {cat}
              </Badge>
          )}
            {frontmatter.tags?.map((tag: string) =>
          <Badge key={tag} variant="secondary">
                #{tag}
              </Badge>
          )}
          </div>
        }
      </div>

      <Separator className="my-8" />

      {/* Content Preview */}
      <div className="mt-8">
        {content ?
        renderMarkdown(content) :

        <p className="text-muted-foreground italic">
            Здесь будет текст вашего поста...
          </p>
        }
      </div>
    </div>);

}