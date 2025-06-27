type Props = {
  title: string;
  score: number;
};
const ScoreCard = ({ title, score }: Props) => {
  return (
    <div className="size-[200px] flex justify-end  bg-[--color-pink-500] rounded-[8px] text-[--text-card-header]">
      <div className="flex flex-col justify-between h-full w-[195px] bg-[--surface-score_card] rounded-[8px] p-[16px]">
        <p className="text-[24px]">論理性{title}</p>
        <p className="text-end text-[40px] font-bold">{score}</p>
      </div>
    </div>
  );
};

export default ScoreCard;
