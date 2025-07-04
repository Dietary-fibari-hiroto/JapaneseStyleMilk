import { motion } from "framer-motion";
type Child = {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
const animationConfig = {
  initial: { filter: "blur(10px) saturate(0%)", opacity: 0 },
  animate: { filter: "blur(0px) saturate(100%)", opacity: 1 },
  exit: { filter: "blur(10px) saturate(0%)", opacity: 0 },
  transition: { duration: 0.5 },
};
const AuthFormContainer = ({ children, onSubmit }: Child) => {
  return (
    <motion.div {...animationConfig}>
      <form
        onSubmit={onSubmit}
        className="flex items-center flex-col space-y-[44px] w-[600px]"
      >
        {children}
      </form>
    </motion.div>
  );
};

export default AuthFormContainer;
