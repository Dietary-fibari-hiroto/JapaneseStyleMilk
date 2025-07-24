import { AudioRecorderService } from "./AudioRecoderService";

export class AudioRecorderController {
  private recorder: AudioRecorderService;

  constructor(stream: MediaStream, mimeType?: string) {
    this.recorder = new AudioRecorderService(stream, mimeType);
  }

  startRecording(): void {
    this.recorder.start();
  }

  async stopRecording(): Promise<Blob> {
    return await this.recorder.stop();
  }

  isRecording(): boolean {
    return this.recorder.isRecording();
  }

  reset(): void {
    this.recorder.reset();
  }

  getAudioURL(): string {
    return this.recorder.getAudioURL();
  }
}
