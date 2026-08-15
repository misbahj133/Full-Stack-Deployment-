import { Helmet } from "react-helmet-async";

const SITE_NAME = "Fieldnotes";

export default function SEO({ title, description, image, url }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — A Journal for Dispatches Worth Reading`;
  const desc =
    description ||
    "Fieldnotes is a blog platform for writing and reading short-form dispatches — essays, notes, and stories.";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
