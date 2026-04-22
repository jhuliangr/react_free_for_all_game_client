/// <reference types="vite/client" />

declare module 'virtual:sprite-manifest' {
  /**
   * Map of character id → animation name → highest frame number found
   * in `public/assets/sprites/<character>-animations/<anim>-<n>.png`.
   * Generated at build time by the sprite-manifest Vite plugin.
   */
  const manifest: Record<string, Record<string, number>>;
  export default manifest;
}
