import {
  Box,
  Button,
  ErrorComponent,
  LoadingComponent,
} from '#shared/components';
import { useGetGameSettings } from '#shared/hooks';
import { Link } from 'react-router';

export const MainMenu = () => {
  const { loading, error } = useGetGameSettings();
  return (
    <div className="flex items-center justify-center flex-1">
      {loading || error ? (
        loading ? (
          <LoadingComponent />
        ) : (
          <ErrorComponent />
        )
      ) : (
        <Box>
          <Link to="/play">
            <Button>Play</Button>
          </Link>

          <Link to="/settings">
            <Button>Settings</Button>
          </Link>
        </Box>
      )}
    </div>
  );
};
