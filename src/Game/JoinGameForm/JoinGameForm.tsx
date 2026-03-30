import { Button } from '#shared/components';
import { gameSocket } from '#shared/services/websocket';
import { useRef } from 'react';

export const JoinGameForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) {
      return;
    }
    const formData = new FormData(formRef.current);

    const data = Object.fromEntries(formData.entries());
    if (!data.name) {
      alert('Your character must have a name');
      return;
    }
    gameSocket.join(data.name as string);
  };
  return (
    <form
      ref={formRef}
      className="flex border p-2 mx-auto rounded-md gap-3"
      onSubmit={handleSubmit}
    >
      <input
        name="name"
        placeholder="Your name"
        className="px-3 py-1 rounded-md"
      />
      <Button type="submit">Join</Button>
    </form>
  );
};
