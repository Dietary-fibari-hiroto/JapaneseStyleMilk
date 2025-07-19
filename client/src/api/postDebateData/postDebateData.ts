export type DebateText = {
  turn_number: number;
  sequence_in_turn: number;
  user_id: number;
  text: string;
};

export type DebatePostPayload = {
  user_id1: number;
  user_id2: number;
  debate_history_id: number;
  debate_topic: string;
  debate_texts: DebateText[];
};

export async function postDebateData(payload: DebatePostPayload) {
  try {
    const response = await fetch("http://localhost:4000/api/evaluation/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Debate data posted:", data);
    return data;
  } catch (error) {
    console.error("❌ Failed to post debate data:", error);
    throw error;
  }
}
