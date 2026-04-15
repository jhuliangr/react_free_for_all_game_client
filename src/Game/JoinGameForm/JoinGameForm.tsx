import { Button, Toast } from '#shared/components';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';

const PLAYER_NAME_KEY = 'player_name';
const MAX_NAME_LENGTH = 15;

interface JoinGameFormProps {
  onJoin: (name: string) => void;
}

export const JoinGameForm = ({ onJoin }: JoinGameFormProps) => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);

    const data = Object.fromEntries(formData.entries());
    if (!data.name) {
      setError('Your character must have a name');
      return;
    }
    const name = data.name as string;
    localStorage.setItem(PLAYER_NAME_KEY, name);
    onJoin(name);
  };

  return (
    <form
      ref={formRef}
      className="flex border p-2 mx-auto rounded-md gap-3 bg-secondary"
      onSubmit={handleSubmit}
    >
      {error && (
        <Toast title="Error" message={error} onDismiss={() => setError(null)} />
      )}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          navigate('/', {
            replace: true,
          })
        }
      >
        Back
      </Button>
      <input
        name="name"
        placeholder="Your name"
        maxLength={MAX_NAME_LENGTH}
        defaultValue={localStorage.getItem(PLAYER_NAME_KEY) ?? ''}
        className="px-3 py-1 rounded-md bg-white"
      />
      <Button type="submit">Join</Button>
    </form>
  );
};
