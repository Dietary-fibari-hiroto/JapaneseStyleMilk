import { useState } from "react";
import axios from "axios";

const useApiError = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleCustomMessage = (message: string) => {
    setErrorMessage(message);
  };

  const handleApiError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        setErrorMessage("リクエストに不備があります。");
      } else if (status === 401) {
        setErrorMessage(
          "認証に失敗しました。メールアドレスまたはパスワードをご確認ください。"
        );
      } else if (status === 500) {
        setErrorMessage(
          "サーバーエラーが発生しました。時間をおいて再度お試しください。"
        );
      } else {
        setErrorMessage("予期せぬエラーが発生しました。");
      }
    } else {
      setErrorMessage("ネットワークまたはその他のエラーが発生しました。");
    }
  };

  const clearError = () => setErrorMessage("");

  return { errorMessage, handleApiError, clearError, handleCustomMessage };
};

export default useApiError;
