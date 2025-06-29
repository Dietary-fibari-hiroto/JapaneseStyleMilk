import Loading from "./Loading";

type Props = {
  isValid: boolean;
  isConnecting?: boolean;
};

const FormButton = ({ isValid, isConnecting = false }: Props) => {
  return (
    <button
      type="submit"
      className={`w-full h-[52px] ${
        isValid
          ? "bg-[--surface-button-primary_button]"
          : "bg-[--surface-button-disabled]"
      } rounded-[8px] text-[--text-button-primary_button] text-header-s font-bold flex-all-center`}
      disabled={!isValid}
    >
      {isConnecting ? <Loading miniMode={true} isWhite={true} /> : <p>次へ</p>}
    </button>
  );
};

export default FormButton;
