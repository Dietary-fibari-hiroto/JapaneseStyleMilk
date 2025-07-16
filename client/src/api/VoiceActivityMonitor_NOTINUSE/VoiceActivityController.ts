// import { AudioRecorderService } from "../AudioRecoder/AudioRecoderService";
// import { VoiceActivityMonitorService } from "./VoiceActivityMonitor";

// export class VoiceActivityController {
//   private vadService: VoiceActivityMonitorService;

//   constructor(stream: MediaStream, recorder: AudioRecorderService) {
//     this.vadService = new VoiceActivityMonitorService(stream);
//   }


//   onVoiceStart(callback: () => void) {
//     this.vadService.setOnVoiceStart(callback);
//   }


//   onVoiceStop(callback: () => void) {
//     this.vadService.setOnVoiceStop(callback);
//   }

//   stopMonitoring() {
//     this.vadService.stop();
//   }
// }
