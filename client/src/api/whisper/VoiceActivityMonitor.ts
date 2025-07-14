import { AudioRecorder } from "../AudioRecoder/AudioRecoder";

class VoiceActivityMonitor {
  private analyser: AnalyserNode;
  private audioContext: AudioContext;
  private threshold: number = 0.05;
  private isSpeaking = false;

  onVoiceStart?: () => void;
  onVoiceStop?: () => void;

  constructor(stream: MediaStream, recorder: AudioRecorder) {
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    source.connect(this.analyser);

    this.startMonitoring();
  }

  private startMonitoring() {
    const dataArray = new Uint8Array(this.analyser.fftSize);

    const detectVoice = () => {
      this.analyser.getByteTimeDomainData(dataArray);
      const volume = this.calculateVolume(dataArray);

      if (volume > this.threshold && !this.isSpeaking) {
        this.isSpeaking = true;
        this.onVoiceStart?.();
      } else if (volume <= this.threshold && this.isSpeaking) {
        this.isSpeaking = false;
        this.onVoiceStop?.();
      }

      requestAnimationFrame(detectVoice);
    };

    detectVoice();
  }

  private calculateVolume(data: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const value = data[i] / 128 - 1.0;
      sum += value * value;
    }
    return Math.sqrt(sum / data.length);
  }

  public stop() {
    this.audioContext?.close();
  }
}
export const uploadAudio = async (blob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm");

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Transcription failed");
  }

  const result = await response.json();
  return result.text; // Whisperの結果を取得
};

export default VoiceActivityMonitor;
