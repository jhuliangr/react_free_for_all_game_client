type Props = {
  children: React.ReactNode;
};
export const Box: React.FC<Props> = ({ children }) => {
  return (
    <div className="border-2 rounded-lg p-4 border-brown bg-dark flex flex-col gap-3 min-w-1/3">
      {children}
    </div>
  );
};
