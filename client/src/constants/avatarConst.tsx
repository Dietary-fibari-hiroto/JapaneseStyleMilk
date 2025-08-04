/**
 * avatarConst.tsx
 * Date : 2025/07/28
 * Author : H.Kitagawa
 * Desc : アバターの色設定定義
 */

type Props = {
  [key:string]: {avatar:string, bgColor:string};
}

// ユーザーアイコン画像名をキーとしてカード表示時のアイコン画像と背景色取得
const avatarConst:Props = {
    "avatar_XL_blue.svg": { avatar: "avatar_black_blue_bg.svg", bgColor:"blue" },
    "avatar_XL_green.svg": { avatar:"avatar_black_green_bg.svg", bgColor:"green" },
    "avatar_XL_grey.svg": { avatar:"avatar_black_grey_bg.svg", bgColor:"grey" },
    "avatar_XL_orange.svg": { avatar:"avatar_black_orange_bg.svg", bgColor:"orange" },
    "avatar_XL_pink.svg": { avatar:"avatar_black_pink_bg.svg", bgColor:"pink" },
    "avatar_XL_purple.svg": { avatar:"avatar_black_purple_bg.svg", bgColor:"purple" },
    "avatar_XL_red.svg": { avatar:"avatar_black_red_bg.svg", bgColor:"red" },
    "avatar_XL_yellow.svg": { avatar:"avatar_black_yellow_bg.svg", bgColor:"yellow" },
    default: {avatar:"avatar_black_yellow_bg.svg", bgColor:"yellow"}
}

export function getAvatarConst(key: string) {
  return avatarConst[key] || avatarConst.default;
}