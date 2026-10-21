import { DocumentText } from './DocumentText';

// Parts use the same formatted-text component as the reviewed Description page.
export function renderInlineText(text: string, key?: number) {
  const runs = text.split(/(\*[A-Za-z][A-Za-z0-9 .-]*\*)/g).map(part =>
    /^\*[A-Za-z][A-Za-z0-9 .-]*\*$/.test(part)
      ? { text: part.slice(1, -1), italic: true }
      : { text: part },
  );
  return <DocumentText key={key} runs={runs} />;
}
