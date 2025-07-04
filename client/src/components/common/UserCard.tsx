/**
* UserCard.tsx
* Date : 2025/06/20
* Author : H.Kitagawa
* Desc : ユーザーカードコンポーネント (ディベート時使用)
*/

import Avatar from "./Avatar"
import AvatarImage from "../../assets/images/Avatars/avatar_black_green_bg.svg";

// ユーザーカードの引数定義
type UserCardProps = {
    path: string
}

/**
 * ユーザーカード コンポーネント
 * @param path 画像パス 
* @returns 指定した画像パスの画像を用いたユーザーアイコン入りのカード
*/
const UserCard = ({path}:UserCardProps) => {
    return(
        <div 
            // 固定: サイズ、角丸め
            className={`
                w-[400px] h-[279px] rounded-[12px] flex justify-center items-center
            `}
        >
            <Avatar image={path} size="xl" />
        </div>
    )
}

export default UserCard;