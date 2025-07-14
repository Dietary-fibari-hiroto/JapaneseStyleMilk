import { Request, Response } from "express";
import * as roundService from "../service/roundService";

export async function startRound(req: Request, res: Response) {
  const sessionId = roundService.startRound();
  res.json({ sessionId });
}

export async function addMessage(req: Request, res: Response) {
  const { sessionId } = req.params as { sessionId: string };
  const { speaker, text } = req.body as { speaker: string; text: string };

  const success = roundService.addMessage(sessionId, speaker, text);
  if (!success) {
    return res.status(400).json({ error: "Invalid or inactive session" });
  }
  res.json({ success: true });
}

export async function endRound(req: Request, res: Response) {
  const { sessionId } = req.params as { sessionId: string };
  const success = roundService.endRound(sessionId);
  if (!success) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json({ success: true });
}

export async function getRound(req: Request, res: Response) {
  const { sessionId } = req.params as { sessionId: string };
  const round = roundService.getRound(sessionId);
  if (!round) {
    return res.status(404).json({ error: "Session not found" });
  }
  res.json(round);
}
