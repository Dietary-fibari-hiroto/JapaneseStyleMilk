/**
 * debateHistory.jsx
 * Date : 2025/07/11
 * Author : H.Kitagawa
 * Desc : ディベート履歴取得API
 */

import axiosInstance from "../utils/axiosInstance";


const debateHistory = async() => {
    // トークン取得
    const token = localStorage.getItem('token');
    
    try {
        // 履歴取得
        const res = await axiosInstance.get('/history', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        })

        return res.data;
    } catch (error) {
        console.error("ディベート履歴取得失敗:", error);
    }
}

export default debateHistory;