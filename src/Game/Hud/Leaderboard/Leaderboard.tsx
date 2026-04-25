import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '#shared/stores';
import { apiClient } from '#shared/utils/api-client';
import type { MatchPlayer } from '#shared/services/game';
import { cn } from '#shared/utils';

const REFRESH_MS = 3000;
const TOP_N = 5;

export const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<MatchPlayer[]>([]);
  const myPlayerId = useGameStore((s) => s.myPlayerId);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const fetchOnce = async () => {
      try {
        const res = await apiClient.gameService.getMatchPlayers(TOP_N);
        if (cancelledRef.current) return;
        setEntries(res.entries);
      } catch (err) {
        console.warn('Leaderboard fetch failed', err);
      }
    };

    fetchOnce();
    const id = setInterval(fetchOnce, REFRESH_MS);
    return () => {
      cancelledRef.current = true;
      clearInterval(id);
    };
  }, []);

  if (entries.length === 0) return null;

  return (
    <div className="absolute top-12 right-5 bg-black/50 rounded px-3 py-2 text-xs text-white min-w-35">
      <div className="font-bold mb-1 text-white/80">Top players</div>
      <ol className="space-y-0.5">
        {entries.map((e, i) => (
          <li
            key={e.id}
            className={cn('flex justify-between gap-3', {
              'text-yellow-300 font-bold': e.id === myPlayerId,
            })}
          >
            <span className="truncate">
              {i + 1}. {e.name}
            </span>
            <span className="tabular-nums text-white/80">{e.kills}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
