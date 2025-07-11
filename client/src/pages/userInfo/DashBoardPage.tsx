import { DebateResultDataCard, EvaluationCard, MonthSelector, ScoreCard } from "../../components";
import debateHistory from "../../api/debateHistory";

// テスト用総合評価
const evaluationItems = [
  { category:"logic", label: "論理性", score: 25},
  { category:"composition", label: "構成力", score: 25},
  { category:"argument", label: "反論力", score: 25},
  { category:"proficiency", label: "英語力", score: 25},
]

const evalutions = [
  { id: 1, title: "五条悟が両面宿儺より強い", date: "2025.12.05", opponent: "○○", },
  { id: 2, title: "-----------------------------------", date: "2026.01.03", opponent: "○○", },
  { id: 3, title: "評価3", date: "2026.01.14", opponent: "○○", },
]


const DashBoardPage = () => {
  // 全ディベート履歴
  const history = debateHistory();
  console.log(history)

  return(
    <div className="gap-8 absolute top-5">
      {/* 月別グラフ・勝敗数 */}
      <div className="flex w-full">
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
      <div className="w-full flex flex-col mb-4">
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

      {/* ディベート・評価履歴 */}
      <div className="flex mb-5">
        {/* 評価履歴 */}
        <div className="w-fit flex flex-col gap-5">
          <p className="text-body-r font-bold">ディベート評価</p>
          <div className="flex flex-col gap-5">
            { evalutions.map((e) => {
                return(
                  <EvaluationCard key={e.id} debateTitle={e.title} userImg1="" userImg2="" date={e.date} path={""} />
                )
            })}
          </div>
        </div>
        
        <div className="w-fit ml-9 gap-2">
          <p className="text-body-r font-bold mb-5">ディベート歴</p>
          <div className="px-4 py-2 bg-[--surface-debate_history_card_frame] rounded-lg w-fit">
            { evalutions.map((e) => {
              return(
                <div className="w-[209px] h-[40px] hover:bg-[--surface-debate_history_card_hover] rounded-lg">
                  <div className="size-full flex items-center gap-2">
                    <p className="text-body-r truncate size-fit p-2">{e.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
};

export default DashBoardPage;
