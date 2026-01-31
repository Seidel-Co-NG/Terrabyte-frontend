import { useEffect } from "react";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "../constants/seoConfig";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  /** Use site name suffix. Default: true */
  appendSiteName?: boolean;
}

/** Renders nothing; updates document title and meta tags for SEO & social sharing */
export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  appendSiteName = true,
}: SEOProps) {
  const fullTitle = title
    ? appendSiteName
      ? `${title} | ${SITE_NAME}`
      : title
    : `${SITE_NAME} – Airtime, Data, Bills & More`;
  const metaDescription = description ?? "Buy airtime, data, pay electricity bills, cable TV, and more. Fast, secure, affordable.";
  const metaKeywords = keywords ?? "Terrabyte, buy airtime, buy data, electricity, cable TV, Nigeria";
  const metaImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  const metaUrl = url ? (url.startsWith("http") ? url : `${SITE_URL}${url}`) : SITE_URL;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      const selector = attr === "name" ? `meta[name="${key}"]` : `meta[property="${key}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Standard meta
    setMeta("name", "description", metaDescription);
    setMeta("name", "keywords", metaKeywords);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", metaDescription);
    setMeta("property", "og:image", metaImage);
    setMeta("property", "og:url", metaUrl);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:type", "website");

    // Twitter Card
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", metaDescription);
    setMeta("name", "twitter:image", metaImage);
    setMeta("name", "twitter:card", "summary_large_image");
  }, [fullTitle, metaDescription, metaKeywords, metaImage, metaUrl]);

  return null;
}
