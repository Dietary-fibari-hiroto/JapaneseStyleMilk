import { LocalWhisperClient } from "./OpenAIWhisperClient";

export class TranscribeAudioUseCase {
  private whisperClient: LocalWhisperClient;

  constructor() {
    this.whisperClient = new LocalWhisperClient();
  }

  async execute(filePath: string): Promise<string> {
    return this.whisperClient.transcribe(filePath);
  }
}
