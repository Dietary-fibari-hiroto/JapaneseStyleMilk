import axiosInstance from "../utils/axiosInstance";

export const getTopic = async () => {
  try {
    const res = await axiosInstance.get("/topics/random");
    return res.data;
  } catch (error) {
    console.error("トピックのデータ取得に失敗しました。");
    return;
  }
};
