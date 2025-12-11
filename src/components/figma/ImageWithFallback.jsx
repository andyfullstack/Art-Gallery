import { useState } from 'react';

export function ImageWithFallback({ src, alt = '', className = '' }) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={
        errored
          ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
          : src
      }
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

export default ImageWithFallback;
