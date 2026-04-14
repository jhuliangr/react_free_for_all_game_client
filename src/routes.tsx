import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { LoadingComponent } from '#shared/components';
import { GameOver } from './GameOver';

const MainMenu = lazy(() =>
  import('./MainMenu').then((m) => ({ default: m.MainMenu })),
);
const NotFound = lazy(() =>
  import('./NotFound').then((m) => ({ default: m.NotFound })),
);
const Achievements = lazy(() =>
  import('./Achievements').then((m) => ({ default: m.Achievements })),
);
const Settings = lazy(() =>
  import('./MainMenu/Settings').then((m) => ({ default: m.Settings })),
);
const Game = lazy(() => import('./Game').then((m) => ({ default: m.Game })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        <Route path="/">
          <Route index Component={MainMenu} />
          <Route path="/play" Component={Game} />
          <Route path="/achievements" Component={Achievements} />
          <Route path="/game-over" Component={GameOver} />
          <Route path="/settings" Component={Settings} />
        </Route>
        <Route path="*" Component={NotFound} />
      </Routes>
    </Suspense>
  );
};
