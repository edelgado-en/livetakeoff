export const pageview = (url) => {
    window.gtag('config', 'G-P251G6PCFY', {
      page_path: url,
    });
  };