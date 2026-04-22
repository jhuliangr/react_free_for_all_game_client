import { useEffect, useRef } from 'react';
import spriteManifest from 'virtual:sprite-manifest';
import { characterRegistry } from '../characters';

export const ANIMATION_NAMES = ['walk', 'attack'] as const;
export type AnimationName = (typeof ANIMATION_NAMES)[number];

export type CharacterAnimations = Partial<
  Record<AnimationName, HTMLImageElement[]>
>;
export type AnimationMap = Record<string, CharacterAnimations>;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadAnimationFrames(
  characterId: string,
  anim: AnimationName,
  count: number,
): Promise<HTMLImageElement[]> {
  // Load every frame in parallel — the frame count comes from the
  // build-time sprite manifest (see vite.config.ts), so we know the
  // exact range and never probe past the last frame.
  const paths = Array.from(
    { length: count },
    (_, i) =>
      `${import.meta.env.BASE_URL}assets/sprites/${characterId}-animations/${anim}-${i + 1}.png`,
  );
  const imgs = await Promise.all(paths.map(loadImage));
  return imgs.filter((img): img is HTMLImageElement => img !== null);
}

export function usePlayerAnimations() {
  const animationsRef = useRef<AnimationMap>({});

  useEffect(() => {
    for (const charDef of characterRegistry.getAll()) {
      animationsRef.current[charDef.id] = {};
      const charFrames = spriteManifest[charDef.id];
      if (!charFrames) continue;
      for (const anim of ANIMATION_NAMES) {
        const count = charFrames[anim] ?? 0;
        if (count <= 0) continue;
        loadAnimationFrames(charDef.id, anim, count).then((frames) => {
          if (frames.length > 0) {
            animationsRef.current[charDef.id][anim] = frames;
          }
        });
      }
    }
  }, []);

  return animationsRef;
}
