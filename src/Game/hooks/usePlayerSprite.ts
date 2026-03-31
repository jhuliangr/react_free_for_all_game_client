import { AVAILABLE_CHARACTERS } from '#shared/constants';
import { useEffect, useRef } from 'react';

export function usePlayerSprite() {
  const spritesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    AVAILABLE_CHARACTERS.forEach((character) => {
      const key = character.toLowerCase();
      const img = new Image();
      img.src = `/assets/sprites/${key}-default-sprite.png`;
      img.onload = () => {
        spritesRef.current[key] = img;
      };
    });
  }, []);

  return spritesRef;
}
