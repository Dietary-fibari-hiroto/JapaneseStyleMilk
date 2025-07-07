import ImagesRoute from "../../../assets/images/ImagesRoute";

type Props = {
  winsValue: number;
};
const DebateResultDataCard = ({ winsValue }: Props) => {
  return (
    <div className="w-[261px] h-[112px] bg-[--surface-winning_data] rounded-[10px] p-[12px] flex flex-col justify-between text-[--text-card-header] text-header-s">
      <div className="w-full flex justify-start">
        <img src={ImagesRoute.trophy_icon} />
        <p>勝ち数</p>
      </div>
      <p className="text-end w-full text-[40px] font-bold">{winsValue}回</p>
    </div>
  );
};

export default DebateResultDataCard;
