import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  robots?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(attr: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function upsertStructuredData(structuredData?: SeoProps['structuredData']) {
  const elementId = 'route-structured-data';
  const existing = document.getElementById(elementId);

  if (!structuredData) {
    existing?.remove();
    return;
  }

  const payload = Array.isArray(structuredData) ? structuredData : [structuredData];
  const script = existing ?? document.createElement('script');
  script.id = elementId;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(payload.length === 1 ? payload[0] : payload);

  if (!existing) {
    document.head.appendChild(script);
  }
}

function Seo({ title, description, path, keywords, robots = 'index,follow', structuredData }: SeoProps) {
  useEffect(() => {
    const canonicalUrl = new URL(path, window.location.origin).toString();

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('name', 'robots', robots);

    if (keywords) {
      upsertMeta('name', 'keywords', keywords);
    }

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', 'Parallel Lab Tools');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', canonicalUrl);

    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    upsertCanonical(canonicalUrl);
    upsertStructuredData(structuredData);
  }, [description, keywords, path, robots, structuredData, title]);

  return null;
}

export default Seo;
