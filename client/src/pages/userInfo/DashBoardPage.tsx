import { DebateResultDataCard, EvaluationCard, MonthSelector, ScoreCard } from "../../components";

// テスト用総合評価
const evaluationItems = [
  { category:"logic", label: "論理性", score: 25},
  { category:"composition", label: "構成力", score: 25},
  { category:"argument", label: "反論力", score: 25},
  { category:"proficiency", label: "英語力", score: 25},
]

const DashBoardPage = () => {
  return(
    <div className="flex flex-col gap-8">
      {/* 月別グラフ・勝敗数 */}
      <div className="flex w-full border">
        <div className="w-[80%]">
          <MonthSelector/>
          <p>グラフ差し替え</p>
        </div>
        <div className="flex flex-col gap-[12px]">
          <DebateResultDataCard resultType="win" resultsValue={2} />
          <DebateResultDataCard resultType="lose" resultsValue={2} />
        </div>
      </div>

      {/* 総合評価 */}
      <div className="w-full flex flex-col">
        <p className="text-body-r font-bold">総合評価</p>
        <div className="w-full flex gap-5">{
          evaluationItems.map((element) => {
            return(
              <ScoreCard
                key={element.category}
                title={element.label}       // 表示文字列
                score={element.score}       // 点数
                category={element.category} // 評価分類(色指定用)
              />
            )
          })
        }</div>
      </div>

      <EvaluationCard debateTitle="title" userImg1="" userImg2="" date="" />
    </div>
  )
};

export default DashBoardPage;
