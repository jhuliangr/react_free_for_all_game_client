import { Button } from '#shared/components';
import { Link } from 'react-router';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-3">
      <title>404 Not Found | Game</title>
      <h1 className="text-gray-500!">404 - Not found</h1>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
};
