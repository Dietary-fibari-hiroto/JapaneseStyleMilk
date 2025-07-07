import { DebateResultDataCard, EvaluationCard, MonthSelector } from "../../components";

const DashBoardPage = () => {
  return(
    <>
      {/* 月別グラフ・勝敗数 */}
      <div className="flex w-full border mb-8">
        <div className="w-[80%]">
          <MonthSelector/>
          <p>グラフ差し替え</p>
        </div>
        <div className="flex flex-col gap-[12px]">
          <DebateResultDataCard resultType="win" resultsValue={2} />
          <DebateResultDataCard resultType="lose" resultsValue={2} />
        </div>
      </div>

      {/*  */}
      <div></div>
      
      <EvaluationCard debateTitle="title" userImg1="" userImg2="" date="" />
    </>
  )
};

export default DashBoardPage;
