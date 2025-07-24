// // service/VoiceActivityMonitorService.ts
// export class VoiceActivityMonitorService {
//   private analyser: AnalyserNode;
//   private audioContext: AudioContext;
//   private threshold: number = 0.05;
//   private isSpeaking = false;
//   private stopTimeoutId: number | null = null;

//   onVoiceStart?: () => void;
//   onVoiceStop?: () => void;

//   constructor(stream: MediaStream) {
//     this.audioContext = new AudioContext();
//     const source = this.audioContext.createMediaStreamSource(stream);
//     this.analyser = this.audioContext.createAnalyser();
//     this.analyser.fftSize = 512;
//     source.connect(this.analyser);
//     this.startMonitoring();
//   }

//   setOnVoiceStart(callback: () => void) {
//     this.onVoiceStart = callback;
//   }

//   setOnVoiceStop(callback: () => void) {
//     this.onVoiceStop = callback;
//   }

//   private startMonitoring() {
//     const dataArray = new Uint8Array(this.analyser.fftSize);
//     const timer = 3000;

//     const detectVoice = () => {
//       this.analyser.getByteTimeDomainData(dataArray);
//       const volume = this.calculateVolume(dataArray);

//       if (volume > this.threshold) {
//         if (!this.isSpeaking) {
//           this.isSpeaking = true;
//           this.onVoiceStart?.();
//         }
//         if (this.stopTimeoutId !== null) {
//           clearTimeout(this.stopTimeoutId);
//           this.stopTimeoutId = null;
//         }
//       } else {
//         if (this.isSpeaking && this.stopTimeoutId === null) {
//           this.stopTimeoutId = window.setTimeout(() => {
//             this.isSpeaking = false;
//             this.onVoiceStop?.();
//             this.stopTimeoutId = null;
//           }, timer);
//         }
//       }
//       requestAnimationFrame(detectVoice);
//     };

//     detectVoice();
//   }

//   private calculateVolume(data: Uint8Array): number {
//     let sum = 0;
//     for (let i = 0; i < data.length; i++) {
//       const value = data[i] / 128 - 1.0;
//       sum += value * value;
//     }
//     return Math.sqrt(sum / data.length);
//   }

//   public stop() {
//     this.audioContext?.close();
//   }
// }
