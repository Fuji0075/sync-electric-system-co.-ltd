export type QuoteButton = { slug: string; name: string };

const MARKER_PREFIX = "[[QUOTE_BUTTONS:";
const MARKER_SUFFIX = "]]";

/**
 * Chat messages are stored as plain text, but an AI reply can carry
 * clickable "ขอใบเสนอราคา" buttons for the products it mentioned by
 * appending a machine-readable marker line to the end of the body. Both
 * the visitor widget and the admin chat view parse it back out with
 * parseChatMessage() before rendering, so the raw marker is never shown.
 */
export function encodeQuoteButtons(products: QuoteButton[]): string {
  if (products.length === 0) return "";
  const payload = products.map((p) => `${p.slug}::${p.name}`).join("||");
  return `\n${MARKER_PREFIX}${payload}${MARKER_SUFFIX}`;
}

export function parseChatMessage(body: string): { text: string; quoteButtons: QuoteButton[] } {
  const markerIndex = body.indexOf(MARKER_PREFIX);
  if (markerIndex === -1) return { text: body, quoteButtons: [] };

  const text = body.slice(0, markerIndex).trimEnd();
  const rest = body.slice(markerIndex + MARKER_PREFIX.length);
  const endIndex = rest.indexOf(MARKER_SUFFIX);
  if (endIndex === -1) return { text: body, quoteButtons: [] };

  const payload = rest.slice(0, endIndex);
  const quoteButtons = payload
    .split("||")
    .map((entry) => {
      const [slug, name] = entry.split("::");
      return { slug, name };
    })
    .filter((b) => b.slug && b.name);

  return { text, quoteButtons };
}
