import { Button } from '#shared/components';
import { Link } from 'react-router';

export const GameOver: React.FC = () => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-dark text-6xl">Game Over</h2>
      <Link to="/play">
        <Button>Play Again</Button>
      </Link>
      <Link to="/">
        <Button>Back to Main Menu</Button>
      </Link>
      <Link to="/settings">
        <Button>Settings</Button>
      </Link>
    </div>
  );
};
