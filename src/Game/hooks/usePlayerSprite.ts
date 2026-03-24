import { useEffect, useState } from 'react';

export function usePlayerSprite(selectedCharacter: string) {
  const [sprite, setSprite] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = `/assets/sprites/${selectedCharacter.toLowerCase()}-default-idle.png`;
    img.onload = () => setSprite(img);
  }, [selectedCharacter]);

  return sprite;
}
