import { uploadAudio } from "./Whisper";

export class TranscriptionController {
  async transcribe(
    sequence_in_turn: number,
    turn_number: number,
    user_id: number,
    blob: Blob
  ): Promise<{
    sequence_in_turn: number;
    turn_number: number;
    user_id: number;
    text: string;
  }> {
    const { text } = await uploadAudio(blob);

    return {
      sequence_in_turn,
      turn_number,
      user_id,
      text,
    };
  }
}
