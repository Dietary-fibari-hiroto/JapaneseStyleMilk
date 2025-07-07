import { useState } from "react";
type Props = {
  isClick: boolean;
};

const CheckBox = ({ isClick = false }: Props) => {
  const [onClick, setOnClick] = useState(false);
  return (
    <button
      onClick={() => {
        setOnClick((prev) => !prev);
      }}
      className={`size-[20px] rounded-[3px] flex-all-center ${
        onClick
          ? "bg-[--surface-check_box_checked]"
          : isClick
          ? ""
          : "border border-[--default]"
      }`}
    >
      {onClick && (
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 1.5L5.16667 8.5L1.5 5"
            stroke="#FAFAFA"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

export default CheckBox;
