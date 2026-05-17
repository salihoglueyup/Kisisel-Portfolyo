import { Helmet } from 'react-helmet-async';

/**
 * @param {object[]|object} schema  Opsiyonel JSON-LD yapısal veri (tek nesne ya da dizi)
 */
const SEO = ({ title, description, keywords, image, type = 'website', schema }) => {
    const siteName = 'YBS.Dev';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Full Stack Developer`;
    const desc = description || 'Eyüp Zeki Salihoğlu - Full Stack Developer portfolyosu.';
    const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
    const schemaList = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            {keywords && <meta name="keywords" content={keywords} />}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            {canonical && <meta property="og:url" content={canonical} />}
            {image && <meta property="og:image" content={image} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            {image && <meta name="twitter:image" content={image} />}

            {/* JSON-LD yapısal veri */}
            {schemaList.map((s, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
