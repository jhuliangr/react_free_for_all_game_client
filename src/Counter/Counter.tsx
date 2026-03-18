import { useState } from 'react';
import { Button } from '#shared/components';

export const Counter: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const handleIncrement = () => {
    setCounter((prev) => prev + 1);
  };
  const handleDecrement = () => {
    setCounter((prev) => prev - 1);
  };
  const handleClear = () => {
    setCounter(0);
  };
  return (
    <div className="flex-1 flex items-center justify-center gap-3">
      Counter: {counter}
      <div className="flex flex-col gap-3">
        <Button onClick={handleIncrement}>Increment</Button>
        <Button onClick={handleDecrement}>Decrement</Button>
        <Button onClick={handleClear} variant="secondary">
          Clear
        </Button>
      </div>
    </div>
  );
};
