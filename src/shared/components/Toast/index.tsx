import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  message: string;
  onDismiss: () => void;
  duration?: number;
};

export const Toast: React.FC<Props> = ({
  title,
  message,
  onDismiss,
  duration = 4000,
}) => {
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(() => onDismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="relative bg-primary/90 border-2 border-primary text-white pl-5 pr-9 py-3 rounded-lg shadow-lg text-center">
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => onDismissRef.current()}
          className="absolute top-1 right-2 text-white/70 hover:text-white text-lg leading-none cursor-pointer"
        >
          ×
        </button>
        <div className="text-xs uppercase tracking-wider text-white/70">
          {title}
        </div>
        <div className="font-bold text-lg">{message}</div>
      </div>
    </div>
  );
};
