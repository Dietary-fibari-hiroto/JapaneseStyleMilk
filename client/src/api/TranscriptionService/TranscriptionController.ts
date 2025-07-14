// controller/TranscriptionController.ts
import { TranscriptionService } from "./TranscriptionService";

export class TranscriptionController {
  private service: TranscriptionService;

  constructor() {
    this.service = new TranscriptionService();
  }

  async transcribe(blob: Blob, socketId: string,round: number): Promise<string | null> {
    try {
      const result = await this.service.transcribeAudio(blob, socketId,round);
      return result.text;
    } catch (err) {
      console.error("文字起こし失敗", err);
      return null;
    }
  }
}
