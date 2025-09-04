import Head from "next/head";

export default function SEO({
  title = "Aparna Munagekar - Creative Designer Portfolio",
  description = "Packaging Designer & Visual Storyteller. Creator of Nataraj Colour Pencils series (10, 12, and 24 colours) packaging.",
  image = "/og-image.jpg",
  url = process.env.NEXT_PUBLIC_SITE_URL ||
    "https://aparna-portfolio.vercel.app",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />
    </Head>
  );
}
