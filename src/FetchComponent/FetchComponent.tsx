import { useGetGameSettings } from './useGetGameSettings';

export const FetchComponent: React.FC = () => {
  const data = useGetGameSettings();

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
};
