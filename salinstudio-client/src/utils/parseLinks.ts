export type TextSegment =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

// Splits text containing markdown-style links, e.g. "[Instagram](https://…)",
// into segments the template renders as text and <a> elements. Only http(s)
// URLs are recognised, and nothing is rendered as raw HTML.
export const parseLinks = (input: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  for (const match of input.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", text: input.slice(lastIndex, index) });
    }
    segments.push({ type: "link", text: match[1], href: match[2] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < input.length) {
    segments.push({ type: "text", text: input.slice(lastIndex) });
  }
  return segments;
};
