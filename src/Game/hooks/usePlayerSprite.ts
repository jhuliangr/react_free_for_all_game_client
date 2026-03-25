import { useEffect, useRef } from 'react';

export function usePlayerSprite(selectedCharacter: string) {
  const spriteRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    spriteRef.current = null;
    const img = new Image();
    img.src = `/assets/sprites/${selectedCharacter.toLowerCase()}-default-idle.png`;
    img.onload = () => {
      spriteRef.current = img;
    };
  }, [selectedCharacter]);

  return spriteRef;
}
