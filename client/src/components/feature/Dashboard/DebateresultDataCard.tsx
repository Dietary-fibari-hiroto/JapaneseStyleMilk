import ImagesRoute from "../../../assets/images/ImagesRoute";

const results = {
  "win": { label: "勝ち数", imgPath: ImagesRoute.trophy_icon },
  "lose": { label: "負け数", imgPath: ImagesRoute.medal_icon }
} as const

type ResultType = keyof typeof results;

type Props = {
  resultType: ResultType; // 勝ち負けどちらを表示するカードか
  resultsValue: number;   // 勝ち/負け回数
};
const DebateResultDataCard = ({ resultType, resultsValue }: Props) => {
  return (
    <div className="w-[261px] h-[112px] bg-[--surface-winning_data] rounded-[10px] p-[12px] flex flex-col justify-between text-[--text-card-header] text-header-s">
      <div className="w-full flex justify-start">
        <img src={results[resultType].imgPath} />
        <p className="text-header-s font-medium">{results[resultType].label}</p>
      </div>
      <p className="text-end w-full text-[40px] font-bold">{resultsValue}回</p>
    </div>
  );
};

export default DebateResultDataCard;
