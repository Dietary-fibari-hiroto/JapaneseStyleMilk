import { TranscriptionService } from "./TranscriptionController";

export class TranscriptionController {
  private service: TranscriptionService;

  constructor() {
    this.service = new TranscriptionService();
  }

  async transcribe(blob: Blob): Promise<string | null> {
    try {
      return await this.service.transcribeAudio(blob);
    } catch (err) {
      console.error("文字起こし失敗", err);
      return null;
    }
  }
}