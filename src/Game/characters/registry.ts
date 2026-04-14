import type { CharacterDefinition } from './types';

class CharacterRegistry {
  private definitions = new Map<string, CharacterDefinition>();
  private defaultId = 'knight';

  register(def: CharacterDefinition): void {
    this.definitions.set(def.id, def);
  }

  get(id: string): CharacterDefinition {
    return this.definitions.get(id) ?? this.definitions.get(this.defaultId)!;
  }

  getAll(): CharacterDefinition[] {
    return Array.from(this.definitions.values());
  }

  getAllIds(): string[] {
    return Array.from(this.definitions.keys());
  }
}

export const characterRegistry = new CharacterRegistry();
