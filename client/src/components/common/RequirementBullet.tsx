type Mode = {
  mode: boolean;
};
const RequirementBullet = ({ mode }: Mode) => {
  return (
    <div
      className={`size-[14px] rounded-full flex-all-center ${
        mode
          ? "bg-[--surface-success]"
          : "border border-[--border-requirement_bullet]"
      } `}
    >
      {mode && (
        <svg
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1L3 5L1 3"
            stroke="#FAFAFA"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default RequirementBullet;
