// Explicit *scientific name* markers support genes and species in the content data.
export function renderInlineText(text: string) {
  return text.split(/(\*[A-Za-z][A-Za-z0-9 .-]*\*)/g).map((part, index) =>
    /^\*[A-Za-z][A-Za-z0-9 .-]*\*$/.test(part)
      ? <em key={index}>{part.slice(1, -1)}</em>
      : part,
  );
}
