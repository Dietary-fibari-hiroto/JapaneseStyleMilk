// ボタン型定義
type PrimaryButtonProps = {
    size: 'Meddium' | 'Large',  // サイズ
    color: 'Main' | 'Sub',      // 色
    shape: 'Round' | 'Square',  // 形
    label: string               // ボタン内文字列
};

// ボタンスタイル型定義 (サイズ, 色, 形)
const ButtonStyle = {
    'Size': {
        'Meddium': 'w-[146px] h-[42px] text-[14px]',
        'Large': 'w-[190px] h-[52px] text-[18px]'
    },

    'Color': {
        'Main': 'text-[#FAFAFA] bg-[#7949F9]',
        'Sub': 'text-[#151515] bg-[#FAFAFA]'
    },

    'Shape': {
        'Round': 'rounded-full',
        'Square': 'rounded-[8px]'
    }
}


/**
 * 主要ボタン コンポーネント
 * @param size ボタンの大きさ 'Meddium' | 'Large'
 * @param color ボタンの色 'Main' | 'Sub'
 * @param shape ボタンの形 'Round' | 'Square'
 * @param label 表示する文字列　string
 * @returns 指定したスタイルのボタン
 */
const PrimaryButton = ({size, color, shape, label}:PrimaryButtonProps) => {
    return(    
        <button
            className={`${ButtonStyle.Size[size]} ${ButtonStyle.Color[color]} ${ButtonStyle.Shape[shape]} font-bold`}
        >{label}</button>
    )
}

export default PrimaryButton;