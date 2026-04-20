import { useEffect, useRef } from 'react';
import { characterRegistry } from '../characters';

export const ANIMATION_NAMES = ['walk', 'attack'] as const;
export type AnimationName = (typeof ANIMATION_NAMES)[number];

export type CharacterAnimations = Partial<
  Record<AnimationName, HTMLImageElement[]>
>;
export type AnimationMap = Record<string, CharacterAnimations>;

const MAX_FRAMES_PER_ANIMATION = 32;

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
): Promise<HTMLImageElement[]> {
  const frames: HTMLImageElement[] = [];
  for (let i = 1; i <= MAX_FRAMES_PER_ANIMATION; i++) {
    const path = `${import.meta.env.BASE_URL}assets/sprites/${characterId}-animations/${anim}-${i}.png`;
    const img = await loadImage(path);
    if (!img) break;
    frames.push(img);
  }
  return frames;
}

export function usePlayerAnimations() {
  const animationsRef = useRef<AnimationMap>({});

  useEffect(() => {
    for (const charDef of characterRegistry.getAll()) {
      animationsRef.current[charDef.id] = {};
      for (const anim of ANIMATION_NAMES) {
        loadAnimationFrames(charDef.id, anim).then((frames) => {
          if (frames.length > 0) {
            animationsRef.current[charDef.id][anim] = frames;
          }
        });
      }
    }
  }, []);

  return animationsRef;
}
