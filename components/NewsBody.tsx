import { Fragment, type ReactNode } from 'react';
import { readNewsBody, type BodyNode } from '@/lib/news-body';
export const newsBodyClass = 'news-body font-serif text-base leading-[2] text-textMain';
function render(n: BodyNode, key: number): ReactNode {
  const children = n.content?.map(render);
  if (n.type === 'text') {
    let text: ReactNode = n.text;
    for (const mark of n.marks ?? []) {
      if (mark.type === 'bold') text = <strong>{text}</strong>;
      if (mark.type === 'italic') text = <em>{text}</em>;
      if (mark.type === 'underline') text = <u>{text}</u>;
      if (mark.type === 'strike') text = <s>{text}</s>;
      if (mark.type === 'textStyle') text = <span style={{ fontSize: mark.attrs?.fontSize as string | undefined }}>{text}</span>;
      if (mark.type === 'link') text = <a href={String(mark.attrs?.href)} rel="noopener noreferrer">{text}</a>;
    }
    return <Fragment key={key}>{text}</Fragment>;
  }
  switch (n.type) {
    case 'doc': return <Fragment key={key}>{children}</Fragment>;
    case 'paragraph': return <p key={key}>{children?.length ? children : <br />}</p>;
    case 'heading': return n.attrs?.level === 3 ? <h3 key={key}>{children}</h3> : <h2 key={key}>{children}</h2>;
    case 'hardBreak': return <br key={key} />;
    case 'horizontalRule': return <hr key={key} />;
    case 'bulletList': return <ul key={key}>{children}</ul>;
    case 'orderedList': return <ol key={key} start={Number(n.attrs?.start ?? 1)}>{children}</ol>;
    case 'listItem': return <li key={key}>{children}</li>;
    case 'blockquote': return <blockquote key={key}>{children}</blockquote>;
  }
}
export default function NewsBody({ body }: { body: string }) {
  try { return <div className={newsBodyClass}>{render(readNewsBody(body), 0)}</div>; }
  catch { return <p className="text-textLight">本文を表示できません。</p>; }
}
