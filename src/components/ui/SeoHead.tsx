import React, { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  keywords?: string[];
  schemaJsonLd?: object | object[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = '/logo.svg',
  keywords,
  schemaJsonLd
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          const propName = selector.match(/property="([^"]+)"/)?.[1] || '';
          element.setAttribute('property', propName);
        } else if (selector.includes('name=')) {
          const nameValue = selector.match(/name="([^"]+)"/)?.[1] || '';
          element.setAttribute('name', nameValue);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // 2. Standard Meta
    setMetaTag('meta[name="description"]', 'content', description);
    if (keywords && keywords.length > 0) {
      setMetaTag('meta[name="keywords"]', 'content', keywords.join(', '));
    }

    // 3. OpenGraph
    setMetaTag('meta[property="og:title"]', 'content', title);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    setMetaTag('meta[property="og:image"]', 'content', ogImage);

    // 4. Twitter
    setMetaTag('meta[name="twitter:title"]', 'content', title);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', ogImage);

    // 5. Canonical Link
    const fullCanonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('?')[0] : '');
    if (fullCanonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', fullCanonical);
    }

    // 6. JSON-LD structured data script
    let scriptTag = document.getElementById('dynamic-jsonld') as HTMLScriptElement;
    if (schemaJsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-jsonld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schemaJsonLd, null, 2);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Cleanup script tag on route transition
      const s = document.getElementById('dynamic-jsonld');
      if (s) s.remove();
    };
  }, [title, description, canonicalUrl, ogType, ogImage, keywords, schemaJsonLd]);

  return null;
};
