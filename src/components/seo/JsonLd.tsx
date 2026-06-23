/**
 * Renders one or more JSON-LD structured-data blocks into the document.
 *
 * Server component — emits a plain <script type="application/ld+json"> tag so
 * the markup is present in the statically exported HTML (crawlable without JS).
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          // Schema is built from trusted in-repo content, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
