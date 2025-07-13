// Whisper.ts
export const uploadAudio = async (
  blob: Blob,
  speakerId: string
): Promise<{ speaker: string; text: string }> => {
  const formData = new FormData();

  formData.append("audio", blob, "audio.webm");
  formData.append("speaker", speakerId);

  const response = await fetch("http://192.168.40.200:5000/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("APIエラー:", errorText);
    throw new Error("Failed to transcribe audio");
  }

  const result = await response.json();
  console.log(result);
  return result;
};
