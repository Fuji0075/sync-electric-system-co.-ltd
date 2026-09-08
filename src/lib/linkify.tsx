const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/** Splits text on URLs and renders them as real clickable links, keeping
 * everything else as plain text. */
export function linkify(text: string, linkClassName = "underline"): React.ReactNode[] {
  // One capturing group in URL_REGEX means String.split keeps the matched
  // URLs in the result array at odd indexes, interleaved with plain text at
  // even indexes — no need to re-test each part against the regex.
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {part}
      </a>
    ) : (
      part
    )
  );
}
