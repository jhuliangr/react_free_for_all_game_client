import { useEffect, useRef } from 'react';

export function useBackgroundImage() {
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/assets/bg-1.png';
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, []);

  return bgImageRef;
}
