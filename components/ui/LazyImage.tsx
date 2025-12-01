import * as React from 'react';

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string; };

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...rest }) => {
  return <img src={src} alt={alt} loading="lazy" decoding="async" {...rest} />;
};

export default LazyImage;
