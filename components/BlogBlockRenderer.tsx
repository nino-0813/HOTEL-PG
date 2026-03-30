import React from 'react';
import Image from 'next/image';
import { toPublicStorageUrl } from '../lib/upload';
import type { Block } from '../types';

export const BlogBlockRenderer: React.FC<{ content: string }> = ({ content }) => {
  let blocks: Block[];
  try {
    const parsed = JSON.parse(content || '[]');
    blocks = Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }

  return (
    <div>
      {blocks.map((block) => {
        const key = block.id || `block-${Math.random()}`;
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={key}>
                {(block.content ?? '').split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </p>
            );
          case 'heading1':
            return (
              <h2 key={key} style={{ textAlign: block.textAlign ?? 'left' }}>
                {block.content ?? ''}
              </h2>
            );
          case 'heading2':
            return (
              <h3 key={key} style={{ textAlign: block.textAlign ?? 'left' }}>
                {block.content ?? ''}
              </h3>
            );
          case 'image':
            if (!block.imageUrl) return null;
            const imageSrc = toPublicStorageUrl(block.imageUrl) ?? block.imageUrl;
            return (
              <figure key={key}>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                  <Image
                    src={imageSrc}
                    alt={block.content ?? ''}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                  />
                </div>
                {block.content ? <figcaption>{block.content}</figcaption> : null}
              </figure>
            );
          case 'bulletList':
            return (
              <ul key={key}>
                {(block.listItems ?? []).filter(Boolean).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case 'numberedList':
            return (
              <ol key={key}>
                {(block.listItems ?? []).filter(Boolean).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={key}>
                {(block.content ?? '').split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </blockquote>
            );
          case 'code':
            return (
              <pre key={key}>
                <code>{block.content ?? ''}</code>
              </pre>
            );
          case 'divider':
            return <hr key={key} />;
          case 'embed':
            const ed = block.embedData;
            if (!ed?.url) return null;
            return (
              <a
                key={key}
                href={ed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-gray-200 rounded-xl p-4 my-6 hover:border-textMain transition-colors no-underline text-textMain"
              >
                {ed.image && (
                  <div className="relative w-full h-32 rounded-lg mb-3 overflow-hidden">
                    <Image
                      src={toPublicStorageUrl(ed.image) ?? ed.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="font-medium">{ed.title || ed.url}</p>
                {ed.description && <p className="text-sm text-gray-500 line-clamp-2 mt-1">{ed.description}</p>}
                {ed.siteName && <span className="text-xs text-gray-400 mt-2 block">{ed.siteName}</span>}
              </a>
            );
          default:
            return <p key={key}>{block.content ?? ''}</p>;
        }
      })}
    </div>
  );
};
