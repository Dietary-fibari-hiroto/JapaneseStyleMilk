/**
* UserCard.tsx
* Date : 2025/06/20
* Author : H.Kitagawa
* Desc : ユーザーカードコンポーネント (ディベート時使用)
*/

import Avatar from "./Avatar"
import AvatarImage from "../../assets/images/Avatars/avatar_black_green_bg.svg";

// カードの色一覧
const CardColors = {
    "red" : "--surface-user-card-user_card_red",
    "yellow": "--surface-user-card-user_card_yellow",
    "blue": "--surface-user-card-user_card_blue",
    "orange": "--surface-user-card-user_card_orange",
    "green": "--surface-user-card-user_card_green",
    "purple": "--surface-user-card-user_card_purple",
    "pink": "--surface-user-card-user_card_pink",
    "black": "--surface-user-card-user_card_black",
    "white": "--surface-user-card-user_card_white",
} as const

// 色一覧のキーを型として定義
type CardColor = keyof typeof CardColors

// ユーザーカードの引数定義
type UserCardProps = {
    color: CardColor
}

/**
 * ユーザーカード コンポーネント
 * @param color カードの色 
 * @returns 指定した色のユーザーカード
 */
const UserCard = ({color}:UserCardProps) => {
    return(
        <div 
            // 固定: サイズ、角丸め
            className={`
                w-[400px] h-[279px] rounded-[12px] flex justify-center items-center
            `}

            // 指定: 背景色
            style={{
                backgroundColor: `var(${CardColors[color]})`
            }}
        >
            <Avatar image={AvatarImage} size="xl" />
        </div>
    )
}

export default UserCard;