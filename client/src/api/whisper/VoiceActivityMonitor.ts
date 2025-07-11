import { start } from "repl";
import {AudioRecorder} from "../AudioRecoder/AudioRecoder"

class VoiceActivityMonitor {
  private analyser: AnalyserNode;
  private threshold: number = 0.02; // 👈 これが閾値（音の大きさ）

  constructor(stream: MediaStream, recorder: AudioRecorder) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    this.analyser = audioContext.createAnalyser();
    source.connect(this.analyser);

    this.startMonitoring();
  }

  private startMonitoring() {
    const dataArray = new Uint8Array(this.analyser.fftSize);

    const detectVoice = () => {
      this.analyser.getByteTimeDomainData(dataArray);
      
      // 振幅（ボリューム）の変動を測定
      const volume = this.calculateVolume(dataArray);

      if (volume > this.threshold) {
        this.onVoiceStart?.();
      } else {
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
    return Math.sqrt(sum / data.length); // RMS (root mean square) volume
  }

  onVoiceStart?: () => void;
  onVoiceStop?: () => void;
}

export default VoiceActivityMonitor