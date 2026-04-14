import { useEffect, useRef } from 'react';

export function useBackgroundImage() {
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}assets/bg-1.png`;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, []);

  return bgImageRef;
}
