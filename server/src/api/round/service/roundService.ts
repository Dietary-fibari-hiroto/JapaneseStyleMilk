import * as roundModel from "../models/roomModel";

export function startRound() {
  return roundModel.createRoundSession();
}

export function addMessage(sessionId: string, speaker: string, text: string) {
  return roundModel.addMessageToRound(sessionId, speaker, text);
}

export function endRound(sessionId: string) {
  return roundModel.endRoundSession(sessionId);
}

export function getRound(sessionId: string) {
  return roundModel.getRoundSession(sessionId);
}
