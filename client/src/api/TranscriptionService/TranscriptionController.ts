// controller/TranscriptionController.ts
import { TranscriptionService } from "./TranscriptionService";

export class TranscriptionController {
  private service: TranscriptionService;

  constructor() {
    this.service = new TranscriptionService();
  }

  async transcribe(blob: Blob, socketId: string): Promise<string | null> {
    try {
      const result = await this.service.transcribeAudio(blob, socketId);
      return result.text;
    } catch (err) {
      console.error("文字起こし失敗", err);
      return null;
    }
  }
}
