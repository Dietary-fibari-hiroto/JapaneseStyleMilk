export enum GameProgress {
  None = "none", //ゲームが始まっていない状態
  Matching = "matching", //マッチング状態
  StandBy = "standby", //ゲーム内待機
  Waite = "waite", //お互いのシステム状態合わせているときの待機状態
  Turn1 = "turn1", //1ターン目
  Turn2 = "turn2", //2ターン目
  Turn3 = "turn3", //3ターン目
  Result = "result", //結果
}

//enumにプロセスインデックスマップ
export const GameProgressIndexMap: Record<GameProgress, number> = {
  [GameProgress.None]: 0,
  [GameProgress.Matching]: 0,
  [GameProgress.StandBy]: 1,
  [GameProgress.Waite]: 0,
  [GameProgress.Turn1]: 2,
  [GameProgress.Turn2]: 4,
  [GameProgress.Turn3]: 6,
  [GameProgress.Result]: 8,
};
