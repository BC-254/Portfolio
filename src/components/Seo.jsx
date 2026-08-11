import { Helmet } from 'react-helmet-async'

const SITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Brian Chege",
  "url": "https://brianchege.com"
}

export default function Seo({ title, description, image, url, schema }) {
  const fullTitle = `Brian Chege | ${title}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content="Brian Chege" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">
        {JSON.stringify(SITE_SCHEMA)}
      </script>
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}