import { Route, Routes } from 'react-router';
import { MainMenu } from './MainMenu';
import { NotFound } from './NotFound';
import { ComingSoon } from './ComingSoon';
import { Settings } from './MainMenu/Settings';
import { Game } from './Game';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index Component={MainMenu} />
        <Route path="/play" Component={Game} />
        <Route path="/achivements" Component={ComingSoon} />
        <Route path="/game-over" Component={ComingSoon} />
        <Route path="/settings" Component={Settings} />
      </Route>
      <Route path="*" Component={NotFound} />
    </Routes>
  );
};
