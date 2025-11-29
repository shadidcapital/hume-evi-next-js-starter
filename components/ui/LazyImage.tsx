import * as React from 'react';
import LazyImage from '@/components/ui/LazyImage';

type LazyImageProps = React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string; };

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...rest }) => {
  return <LazyImage src={src} alt={alt} loading="lazy" decoding="async" {...rest} />;
};

export default LazyImage;
