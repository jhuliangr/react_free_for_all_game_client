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
        <div className="flex flex-col gap-10 w-1/3 text-center">
          <div>
            <h1 className="text-primary font-bold text-7xl p-3">Arena</h1>
            <p className="text-dark">Try your best to stay standing</p>
          </div>
          <Box>
            <Link to="/play">
              <Button>Play</Button>
            </Link>

            <Link to="/achievements">
              <Button>Achievements</Button>
            </Link>

            <Link to="/settings">
              <Button>Settings</Button>
            </Link>
          </Box>
        </div>
      )}
    </div>
  );
};
