import { Link } from 'react-router';
import { CharacterSelector } from './CharacterSelector';
import { SkinSelector } from './SkinSelector';
import { Button } from '#shared/components';

export const Settings: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-around flex-col gap-5">
      <title>Settings | Game</title>
      <div className="flex items-center justify-between gap-5">
        <Link to="/">
          <Button>Back</Button>
        </Link>
        <CharacterSelector />
      </div>
      <SkinSelector />
    </div>
  );
};
