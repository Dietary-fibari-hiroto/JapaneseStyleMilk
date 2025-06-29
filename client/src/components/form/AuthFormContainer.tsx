type Child = {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
const AuthFormContainer = ({ children, onSubmit }: Child) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex-all-center flex-col space-y-[44px]"
    >
      {children}
    </form>
  );
};

export default AuthFormContainer;
