/**
 * SectionHeader.tsx
 * Date : 2025/06/23
 * Author : H.Kitagawa
 * Desc : ページ上部テキスト コンポーネント
 */
// 表示ラベル定義
const TurnList = [
  { label: "接続中...", time: 2000 },
  { label: "準備中...", time: 2000 },
  { label: "シンキングタイム(1分)", time: 60000 },
  { label: "Round1", time: 5000 },
  { label: "シンキングタイム(1分)", time: 60000 },
  { label: "Round2", time: 5000 },
  { label: "シンキングタイム(1分)", time: 60000 },
  { label: "Round3", time: 5000 },
];

// 引数定義
type SectionHeaderProps = {
  mode: "single" | "anime";
  name?: string;
  currentTurn: number;
};

/**
 * ページ上部の太字テキスト表示コンポーネント
 * @param mode  表示モード(アニメーション有/無)
 * @param name  アニメーション無しの場合に表示するユーザー名
 * @returns     アニメーションの有無を指定したページ上部テキスト
 */
const SectionHeader = ({ mode, name, currentTurn }: SectionHeaderProps) => {
  /* 以下 アニメーション設定 (後で修正) */

  if (mode === "anime") {
    return (
      <div className="h-[92px] w-[820px] relative overflow-hidden">
        <div className="transition">
          {/* ターン見出し生成 */}
          {TurnList.map((element, index) => {
            // console.log(element.label, ` translate-y-[${currentTurn*100}%]`)
            return (
              <p
                key={`SectionHeader-${index}`}
                // 固定: 縦横(92*820px)、上下中央揃え、文字色、太文字、文字サイズ
                className={`
                                    h-[92px] w-[820px] flex items-center 
                                    text-[--text-header-primary] font-bold text-header-l
                                `}
                // アニメーション方向・距離・時間
                style={{
                  transform: `translateY(-${currentTurn * 100}%)`,
                  transitionDuration: "300ms",
                }}
              >
                {element.label}
              </p>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div
        // 固定: 縦横幅、文字サイズ、太字、整列規則(上下中央揃え、縦方向整列)
        className={`
                w-full h-[112px] text-header-l font-bold flex flex-col
            `}
      >
        <p
          // 固定: 余白、高さ、文字色、太字、
          className="m-auto ml-0 h-[52px] text-[--text-header_primary]"
        >
          こんにちは{name}さん
        </p>
        <p
          // 固定: 余白、高さ、文字色
          className="m-auto ml-0 h-[52px] text-[--text-header_secondary]"
        >
          今日もディベートやる？
        </p>
      </div>
    );
  }
};

export default SectionHeader;
