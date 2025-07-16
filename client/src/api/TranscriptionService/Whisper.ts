export const uploadAudio = async (
  blob: Blob,
  speakerId: string,
  currentRound: number,
  sequenceInTurn: number
): Promise<{ speaker: string; text: string }> => {
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm");
  formData.append("speaker", speakerId);
  formData.append("sequence_in_turn", String(sequenceInTurn));
  formData.append("round", currentRound.toString());

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
  return {
    speaker: result.speaker,
    text: result.text,
  };
};
