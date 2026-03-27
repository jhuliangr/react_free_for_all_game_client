import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <main>
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
