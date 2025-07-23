export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private mimeType: string = "audio/webm";
  private isStopping = false;

  constructor(stream: MediaStream, mimeType = "audio/webm") {
    this.stream = stream;
    if (MediaRecorder.isTypeSupported(mimeType)) {
      this.mimeType = mimeType;
    }
  }

  start(): void {
    if (!this.stream) throw new Error("No MediaStream provided.");
    if (this.mediaRecorder?.state === "recording") throw new Error("すでに録音中です");

    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: this.mimeType });
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.recordedChunks.push(event.data);
    };
    this.mediaRecorder.start();
  }

  stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive" || this.isStopping) {
        return reject("録音を停止できません");
      }
      this.isStopping = true;
      this.mediaRecorder.onstop = () => {
        this.isStopping = false;
        const audioBlob = new Blob(this.recordedChunks, { type: this.mimeType });
        resolve(audioBlob);
      };
      this.mediaRecorder.stop();
    });
  }

  reset(): void {
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  getAudioURL(): string {
    const blob = new Blob(this.recordedChunks, { type: this.mimeType });
    return URL.createObjectURL(blob);
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}