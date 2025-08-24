import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: string;
}

export function SEOHead({ title, description, url, image, type = "article" }: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    document.title = `${title} | YBYMythBust`;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Set Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'YBYMythBust' },
    ];

    if (url) {
      ogTags.push({ property: 'og:url', content: url });
    }

    if (image) {
      ogTags.push({ property: 'og:image', content: image });
    }

    ogTags.forEach(({ property, content }) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Set Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ];

    if (image) {
      twitterTags.push({ name: 'twitter:image', content: image });
    }

    twitterTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Add structured data for articles
    if (type === 'article') {
      const structuredData: any = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "publisher": {
          "@type": "Organization",
          "name": "YBYMythBust"
        }
      };

      if (url) structuredData.url = url;
      if (image) structuredData.image = image;

      let script = document.querySelector('#structured-data') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, url, image, type]);

  return null;
}
