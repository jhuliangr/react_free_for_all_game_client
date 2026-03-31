import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <main className="flex items-center justify-center min-h-screen bg-brown">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
