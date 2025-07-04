/**
 * Avatar.tsx
 * Date : 2025/06/20
 * Author : H.Kitagawa
 * Desc : ユーザーアイコンコンポーネント
 */

// ユーザーアイコンのサイズ定義
const AvatarSizes = {
  mini: "w-[32px] h-[32px]",
  small: "w-[44px] h-[44px]",
  regular: "w-[56px] h-[56px]",
  large: "w-[64px] h-[64px]",
  xl: "w-[158px] h-[158px]",
} as const;

// アイコンサイズを型として定義
type AvatarSize = keyof typeof AvatarSizes;

// ユーザーアイコンの引数定義
type AvatarProps = {
  image: string; // 画像名
  size: AvatarSize;
};

/**
 * ユーザーアイコン コンポーネント
 * @param image アイコン画像名
 * @param size  アイコンの大きさ
 * @returns     指定した画像を整形したアイコン
 */
const Avatar = ({ image, size }: AvatarProps) => {
  return (
    <img
      // 指定: サイズ
      // 固定: 角丸め(最大)
      className={`
                ${AvatarSizes[size]} rounded-full overflow-hidden bg-black flex flex-shrink-0`}
      // 画像パス指定
      src={`${process.env.REACT_APP_IMAGE_URL}/${image}`}
      alt="ユーザーアイコンの画像"
    />
  );
};

export default Avatar;
