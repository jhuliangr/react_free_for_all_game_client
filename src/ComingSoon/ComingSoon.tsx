import { Button } from '#shared/components';
import { Link } from 'react-router';

export const ComingSoon: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-3">
      <title>Coming Soon | Game</title>
      <h1 className="text-teal-500!">Coming Soon</h1>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
};
