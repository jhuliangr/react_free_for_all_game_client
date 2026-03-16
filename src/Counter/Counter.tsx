import { useState } from 'react';

export const Counter: React.FC = () => {
  const [counter, setCounter] = useState<number>(0);
  const handleIncrement = () => {
    setCounter((prev) => prev + 1);
  };
  return (
    <div className="flex-1 flex items-center justify-center gap-3">
      Counter: {counter}
      <button
        className="px-3 py-1 bg-gray-200 rounded-md"
        onClick={handleIncrement}
      >
        Increment
      </button>
    </div>
  );
};
