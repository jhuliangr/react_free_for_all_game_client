import { useEffect } from 'react';

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
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(), duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-primary/90 border-2 border-primary text-white px-5 py-3 rounded-lg shadow-lg text-center">
        <div className="text-xs uppercase tracking-wider text-white/70">
          {title}
        </div>
        <div className="font-bold text-lg">{message}</div>
      </div>
    </div>
  );
};
