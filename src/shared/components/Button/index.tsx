import { cn } from '#shared/utils';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button: React.FC<Props> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'w-full px-3 py-1 rounded-md transition-opacity duration-200',
        {
          primary:
            'bg-primary disabled:opacity-80 hover:opacity-80 disabled:cursor-not-allowed text-white',
          secondary:
            'bg-secondary disabled:opacity-80 hover:opacity-80 text-white',
        }[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
