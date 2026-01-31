import { useLocation } from "react-router-dom";
import SEO from "./SEO";
import { getSEOForPath, SITE_URL } from "../constants/seoConfig";

/**
 * Route-aware SEO. Reads current pathname and applies metadata from seoConfig.
 * Add new routes in constants/seoConfig.ts to scale – header values reflect the page.
 */
export default function SEOWrapper() {
  const { pathname } = useLocation();
  const config = getSEOForPath(pathname);
  const canonicalUrl = `${SITE_URL}${pathname === "/" ? "" : pathname}`;

  return (
    <SEO
      title={config.title}
      description={config.description}
      keywords={config.keywords}
      url={canonicalUrl}
      appendSiteName={true}
    />
  );
}
