type Props = {
  title: string;
  score: number;
  category: string;
};
const ScoreCard = ({ title, score, category }: Props) => {
  return (
    <div className={`size-[200px] flex justify-end rounded-[8px] text-[--text-card-header]`} style={{backgroundColor: `var(--border-score_card-${category})`}}>
      <div className="flex flex-col justify-between h-full w-[195px] bg-[--surface-score_card] rounded-[8px] pt-[10px] pb-2 pl-6 pr-4">
        <p className="text-[24px] font-medium">{title}</p>
        <p className="text-end text-[40px] font-bold">{score}点</p>
      </div>
    </div>
  );
};

export default ScoreCard;
