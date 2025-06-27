import { useState } from "react";

const MonthSelector = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());

  const handleMoveOn = () => {
    setMonth((prev) => {
      if (prev >= 12) {
        setYear((y) => y + 1);
        return 1;
      }
      return prev + 1;
    });
  };
  const handleTurnBack = () => {
    setMonth((prev) => {
      if (prev <= 1) {
        setYear((y) => y - 1);
        return 12;
      }
      return prev - 1;
    });
  };

  return (
    <div className="p-[4px] space-x-[6px] flex items-center ">
      <button onClick={handleTurnBack}>
        <svg
          width="13"
          height="16"
          viewBox="0 0 13 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 9.73205C-0.333332 8.96225 -0.333334 7.03775 0.999999 6.26795L10 1.0718C11.3333 0.301996 13 1.26425 13 2.80385L13 13.1962C13 14.7358 11.3333 15.698 10 14.9282L1 9.73205Z"
            fill="#464646"
          />
        </svg>
      </button>
      <p>
        {year}.{month}
      </p>
      <button onClick={handleMoveOn}>
        <svg
          width="13"
          height="14"
          viewBox="0 0 13 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.8029 5.24645C13.1872 6.0057 13.1872 7.9943 11.8029 8.75355L2.96179 13.6027C1.62894 14.3338 0 13.3694 0 11.8492V2.15081C0 0.630631 1.62894 -0.333797 2.96179 0.397251L11.8029 5.24645Z"
            fill="#464646"
          />
        </svg>
      </button>
    </div>
  );
};

export default MonthSelector;
