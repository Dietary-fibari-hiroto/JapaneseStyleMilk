import React, { createContext, useContext, useState } from "react";
import { OpponentAccount } from "../types";

type OpponentContextType = {
  opponent: OpponentAccount | null;
  setOpponent: (account: OpponentAccount) => void;
};

const OpponentContext = createContext<OpponentContextType | undefined>(
  undefined
);

export const OpponentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [opponent, setOpponent] = useState<OpponentAccount | null>(null);

  return (
    <OpponentContext.Provider value={{ opponent, setOpponent }}>
      {children}
    </OpponentContext.Provider>
  );
};

export const useOpponent = () => {
  const context = useContext(OpponentContext);
  if (!context) {
    throw new Error("useOpponent must be used within an OpponentProvider");
  }
  return context;
};
