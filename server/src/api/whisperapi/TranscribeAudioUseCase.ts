import { OpenAIWhisperClient } from "./OpenAIWhisperClient";

export class TranscribeAudioUseCase {
  private whisperClient: OpenAIWhisperClient;

  constructor() {
    this.whisperClient = new OpenAIWhisperClient();
  }

  async execute(filePath: string): Promise<string> {
    return this.whisperClient.transcribe(filePath);
  }
}
