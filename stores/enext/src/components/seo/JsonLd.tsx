/**
 * Server component that injects JSON-LD structured data.
 * `<` is escaped so a title/description containing "</script>" can't break out.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
