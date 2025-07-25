import { useAccount } from "../../contexts/AccountContext";

const EvaluationPage = () => {
  // ユーザー情報取得
  const user = useAccount();

  return (
    <div className="w-[60%] flex flex-col justufy-start items-start space-y-[50px] mt-[50px] pt-8">
      <div className="flex flex-col">
        <p className="text-[32px] font-bold">
          プラスチック製品の使用を禁止すべきか？
        </p>
        <p className="text-header-r">2025.07.14</p>
      </div>
      <section className="flex flex-col space-y-[20px]">
        <div className="flex flex-col space-y-[20px]">
          <p className="font-bold text-[24px]">
            総合評価：非常に優れたパフォーマンス
          </p>
          <p className="text-[16px]">
            {`${user.account?.name}さんは、論理的な明確さと説得力ある話し方を兼ね備えた見事なパフォーマンスを披露し、勝利に大きく貢献しました。審査員および聴衆に強い印象を残し、非常に高い評価を受けました。`}
          </p>
        </div>
        <div className="flex flex-col space-y-[20px]">
          <p className="text-[24px] font-bold">強み</p>
          <div className="flex flex-col">
            <p className="text-[18px] font-semibold">1.論理力 (25/25)</p>
            <p className="text-[16px] ml-[20px]">
              主張は一貫しており、聞き手に伝えたい意図は明確だった。しかし、論点をより強固にするための具体例やデータがやや不足しており、全体的にやや抽象的な印象を受けた。もう一歩踏み込んで根拠を示すことで、より説得力が増すと感じられた。
            </p>
          </div>
          <div className="flex flex-col space-y-[20px]">
            <p className="text-[18px] font-semibold">2.構成力</p>
            <p className="text-[16px] ml-[20px]">
              序論から結論までの流れは明瞭で、話の展開にも無理がなく、自然な構成だった。各セクションがスムーズにつながっており、聞き手にとって理解しやすい構成ができていた点は評価できる。ただし、一部のポイントがやや簡略化されていたため、もう少し詳しく展開すると説得力がさらに高まる。
            </p>
          </div>
          <div className="flex flex-col space-y-[20px]">
            <p className="text-[18px] font-semibold">3.反論力</p>
            <p className="text-[16px] ml-[20px]">
              相手の主張に対する反応は見られたが、反論の際の論理性や冷静さに少し課題が残った。反論がやや感情的に聞こえる部分もあり、建設的な批判としての深みには欠けていた。相手の立場を理解した上で冷静に反論し、より客観的に論理を組み立てることが今後の課題となる。{" "}
            </p>
          </div>{" "}
          <div className="flex flex-col space-y-[20px]">
            <p className="text-[18px] font-semibold">4.英語力</p>
            <p className="text-[16px] ml-[20px]">
              基本的な文法や語彙は適切で、全体として意味はしっかり伝わっていた。ただし、一部の表現にやや不自然さがあり、より自然で流暢な表現に磨きをかける余地がある。発音やイントネーションもおおむね良好だが、ネイティブらしい表現をもう少し意識できるとより良くなる。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EvaluationPage;
