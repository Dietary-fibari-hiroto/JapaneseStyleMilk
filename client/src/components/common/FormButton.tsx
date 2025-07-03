import Loading from "./Loading";

type Props = {
  isValid?: boolean;
  isConnecting?: boolean;
  label?: string;
};

const FormButton = ({
  isValid = true,
  isConnecting = false,
  label = "次へ",
}: Props) => {
  return (
    <button
      type="submit"
      className={`min-w-[373px] h-[52px] ${
        isValid
          ? "bg-[--surface-button-primary_button]"
          : "bg-[--surface-button-disabled]"
      } rounded-[8px] text-[--text-button-primary_button] text-header-s font-bold flex-all-center`}
      disabled={!isValid}
    >
      {isConnecting ? (
        <Loading miniMode={true} isWhite={true} />
      ) : (
        <p>{label}</p>
      )}
    </button>
  );
};

export default FormButton;
