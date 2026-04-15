import { useEffect, useRef } from 'react';
import { characterRegistry } from '../characters';

export function usePlayerSprite() {
  const spritesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    for (const charDef of characterRegistry.getAll()) {
      const key = charDef.id;
      const img = new Image();
      img.src = charDef.getSpritePath();
      img.onload = () => {
        spritesRef.current[key] = img;
      };
    }
  }, []);

  return spritesRef;
}
