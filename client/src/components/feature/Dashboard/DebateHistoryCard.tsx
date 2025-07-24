/**
* DebateHistoryCard.tsx
* Date : 2025/07/25
* Author : H.Kitagawa
* Desc : ディベート履歴画面への遷移用カード(ダッシュボードに配置)
*/

import { useNavigate } from "react-router-dom";

// 引数定義
type Props = {
    id: number;     // 履歴ID
    topic: string;  // ディベートのお題
}

const DebateHistoryCard = ({id, topic}: Props) => {
    const navigate = useNavigate();

    return(
        <div 
            className="w-[209px] h-[40px] hover:bg-[--surface-debate_history_card_hover] rounded-lg"
            onClick={() => navigate(`/dashboard/:accountId/history/${id}`)}
        >
            <div className="size-full flex items-center gap-2">
            <p className="text-body-r truncate size-fit p-2">{topic}</p>
            </div>
        </div>
    )
}

export default DebateHistoryCard;