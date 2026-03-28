import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
    const siteName = 'YBS.Dev';
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Full Stack Developer`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || 'Eyüp Zeki Salihoğlu - Full Stack Developer portfolyosu.'} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || ''} />
        </Helmet>
    );
};

export default SEO;
