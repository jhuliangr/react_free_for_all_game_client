import { useSettingsStore } from '#shared/stores';
import { useEffect, useState } from 'react';

type Props = {
  cooldownActiveRef: React.RefObject<boolean>;
};

export const CooldownIndicator: React.FC<Props> = ({ cooldownActiveRef }) => {
  const stats = useSettingsStore((s) => s.getSelectedCharacterStats());
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (stats.cooldown_ms === 0) return;

    const interval = setInterval(() => {
      setActive(cooldownActiveRef.current);
    }, 50);
    return () => clearInterval(interval);
  }, [stats.cooldown_ms, cooldownActiveRef]);

  if (stats.cooldown_ms === 0) return null;

  return (
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
      <div
        className={`w-16 h-2 rounded-full border border-white/30 overflow-hidden transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}
      >
        <div
          className={`h-full rounded-full transition-all ${active ? 'bg-red-500 w-0' : 'bg-lime-400 w-full'}`}
          style={{
            transitionDuration: active ? `${stats.cooldown_ms}ms` : '100ms',
          }}
        />
      </div>
    </div>
  );
};
