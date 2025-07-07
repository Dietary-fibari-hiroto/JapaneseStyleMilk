// ボタンスタイル型定義 (サイズ, 色, 形)
const ButtonStyle = {
  Size: {
    Meddium: "w-[146px] h-[42px] text-[14px]",
    Large: "w-[190px] h-[52px] text-[18px]",
  },

  // Main: 紫背景/白文字, Sub: 白背景/黒文字, Disabled: 灰色背景/白文字
  Color: {
    Main: "text-[--text-button-primary_button] bg-[--surface-button-primary_button] hover:bg-[--surface-button-primary_button_hover]",
    Sub: "text-[--text-button-secondary_button] bg-[--surface-button-secondary_button] hover:bg-[--surface-button-secondary_button_hover]",
    Disabled: "text-[--text-button-primary_button] bg-[--surface-button-disabled]"
  },

  Shape: {
    Round: "rounded-full",
    Square: "rounded-[8px]",
  },
};

// サイズ、色、形を型として宣言
type ButtonSize = keyof typeof ButtonStyle.Size;
type ButtonColor = keyof typeof ButtonStyle.Color;
type ButtonShape = keyof typeof ButtonStyle.Shape;

// ボタン型定義
type PrimaryButtonProps = {
  size: ButtonSize;     // ボタンの大きさ
  color: ButtonColor;   // ボタンの色
  shape: ButtonShape;   // ボタンの形
  label: string;        // 表示文字
  onClick?: () => void;
};



/**
 * 主要ボタン コンポーネント
 * @param size ボタンの大きさ 'Meddium' | 'Large'
 * @param color ボタンの色 'Main' | 'Sub'
 * @param shape ボタンの形 'Round' | 'Square'

 * @param label 表示する文字列　string

 * @returns 指定したスタイルのボタン
 */
const PrimaryButton = ({
  size,
  color,
  shape,
  label,
  onClick,
}: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      // 指定: サイズ、色、形
      // 固定: 太字, アニメーション速度(300s)
      className={`
        ${ButtonStyle.Size[size]} ${ButtonStyle.Color[color]} ${ButtonStyle.Shape[shape]}
        font-bold transition duration-300
      `}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
