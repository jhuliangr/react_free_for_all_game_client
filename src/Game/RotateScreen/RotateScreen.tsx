import { useIsPortrait } from './useIsPortrait';

interface Props {
  isMobile: boolean;
}

export const RotateScreen: React.FC<Props> = ({ isMobile }) => {
  const isPortrait = useIsPortrait();
  if (isMobile && isPortrait) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12" y2="18.01" />
        </svg>
        <p className="text-xl font-semibold">Rotate your device</p>
        <p className="text-sm text-gray-400">
          This game requires landscape mode
        </p>
      </div>
    );
  }
  return null;
};
