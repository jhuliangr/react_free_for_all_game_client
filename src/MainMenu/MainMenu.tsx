import { Box, Button } from '#shared/components';
import { Link } from 'react-router';
import { FetchSettingsComponent } from './FetchComponent';

export const MainMenu: React.FC = () => {
  return (
    <div className="flex items-center justify-center flex-1">
      <FetchSettingsComponent />
      <Box>
        <Link to="/play">
          <Button>Play</Button>
        </Link>

        <Link to="/settings">
          <Button>Settings</Button>
        </Link>
      </Box>
    </div>
  );
};
