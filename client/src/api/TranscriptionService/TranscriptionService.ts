// service/TranscriptionService.ts
import { uploadAudio } from "./Whisper";

export class TranscriptionService {
  async transcribeAudio(
    blob: Blob,
    socketId: string
  ): Promise<{ speaker: string; text: string }> {
    return await uploadAudio(blob, socketId);
  }
}
