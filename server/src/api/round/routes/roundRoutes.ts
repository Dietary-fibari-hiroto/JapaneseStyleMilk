import express from "express";
import {
  startRound,
  addMessage,
  endRound,
  getRound,
} from "../controllers/roundController";
console.log(typeof addMessage); // ここで 'function' と出るか確認

const router = express.Router();

router.post("/start", startRound);
router.post("/:sessionId/message", addMessage);
router.post("/:sessionId/end", endRound);
router.get("/:sessionId", getRound);

export default router;
