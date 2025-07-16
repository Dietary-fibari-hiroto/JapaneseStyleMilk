import { uploadAudio } from "./Whisper";

export class TranscriptionController {
  // 🔹 既存の transcribe メソッド（もし使ってるなら残す）
  async transcribe(
    blob: Blob,
    speakerId: string,
    round: number,
    sequenceInTurn: number
  ): Promise<{ speaker: string; text: string }> {
    return await uploadAudio(blob, speakerId, round, sequenceInTurn);
  }

  // 🔹 評価も一緒に送信するメソッド（今回追加するやつ）
  async transcribeAndEvaluate(
    blob: Blob,
    speakerId: string,
    round: number,
    sequenceInTurn: number
  ): Promise<{ speaker: string; text: string }> {
    const { speaker, text } = await uploadAudio(
      blob,
      speakerId,
      round,
      sequenceInTurn
    );

    await fetch("http://localhost:4000/api/evaluation/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: speakerId,
        text,
        turn_number: round,
        sequence_in_turn: sequenceInTurn,
      }),
    });

    return { speaker, text };
  }
}
