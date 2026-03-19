import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes';

function App() {
  return (
    <>
      <h1>React client</h1>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
