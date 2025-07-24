import { useParams } from "react-router-dom";
import { DebateHistory } from "../../components";

// ダミーデータ
const testHistory = [
  {
    "debate_info": {
      "id": 1,
      "topic": "オンライン教育は従来の教育を置き換えるか？",
      "created_at": "2024-01-03T08:12:34.000Z",
      "role": 1,
      "win_flag": 1
    },
    "debate_texts": [
      {
        "turn_number": 1,
        "sequence_in_turn": 1,
        "text": "Online education offers flexibility that traditional classrooms cannot. Students can study at their own pace and revisit materials as needed. This autonomy can enhance retention and accommodate diverse learning styles."
      },
      {
        "turn_number": 1,
        "sequence_in_turn": 2,
        "text": "It enables access to learning resources from anywhere in the world. Students in remote areas can benefit from quality education previously unavailable to them. This can help bridge educational gaps across regions."
      },
      {
        "turn_number": 2,
        "sequence_in_turn": 1,
        "text": "However, it may lack the social interaction and hands-on experience of in-person classes. Group activities and peer communication are essential for developing interpersonal skills. Online platforms must find ways to simulate these elements effectively."
      }
    ]
  },
  {
    "debate_info": {
      "id": 2,
      "topic": "AIは人間の仕事を奪うか？",
      "created_at": "2024-01-08T14:55:21.000Z",
      "role": 1,
      "win_flag": 1
    },
    "debate_texts": [
      {
        "turn_number": 1,
        "sequence_in_turn": 1,
        "text": "AI has the potential to automate many tasks currently done by humans. Routine jobs like data entry and basic customer service are already being handled by machines. This shift could lead to increased productivity and reduced labor costs."
      },
      {
        "turn_number": 1,
        "sequence_in_turn": 2,
        "text": "It can improve efficiency and reduce errors in various industries. In healthcare, for example, AI assists in diagnostics and treatment planning. This supports professionals in making more accurate and timely decisions."
      },
      {
        "turn_number": 2,
        "sequence_in_turn": 1,
        "text": "Yet, new jobs may emerge that require human creativity and oversight. Roles in AI ethics, system design, and human-AI interaction are growing fields. As with past technological revolutions, the job market will evolve rather than vanish."
      }
    ]
  },
  {
    "debate_info": {
      "id": 3,
      "topic": "リモートワークはオフィスワークより効率的か？",
      "created_at": "2024-01-12T19:43:10.000Z",
      "role": 1,
      "win_flag": 1
    },
    "debate_texts": [
      {
        "turn_number": 1,
        "sequence_in_turn": 1,
        "text": "Remote work eliminates commuting, saving employees valuable time. This time can be reallocated to work or personal wellness, improving overall life balance. Less commuting also reduces environmental impact."
      },
      {
        "turn_number": 1,
        "sequence_in_turn": 2,
        "text": "It allows workers to create a personalized and distraction-free environment. Some find that productivity improves when they control their surroundings. Noise, temperature, and layout can all be optimized at home."
      },
      {
        "turn_number": 2,
        "sequence_in_turn": 1,
        "text": "However, it may reduce spontaneous collaboration and team bonding. Informal conversations that spark innovation are harder to replicate online. Maintaining company culture can also be more challenging remotely."
      }
    ]
  },
  {
    "debate_info": {
      "id": 4,
      "topic": "ソーシャルメディアは社会に有益か？",
      "created_at": "2024-01-15T07:29:45.000Z",
      "role": 1,
      "win_flag": 1
    },
    "debate_texts": [
      {
        "turn_number": 1,
        "sequence_in_turn": 1,
        "text": "Social media empowers activism and raises awareness on global issues. Movements like #MeToo and climate justice gained traction through these platforms. Marginalized voices find space to be heard in a broader public arena."
      },
      {
        "turn_number": 1,
        "sequence_in_turn": 2,
        "text": "It helps people maintain relationships despite physical distance. Family and friends can share moments in real-time, regardless of geography. This connectivity fosters a sense of community and emotional support."
      },
      {
        "turn_number": 2,
        "sequence_in_turn": 1,
        "text": "Nonetheless, it can spread misinformation and fuel polarization. Algorithms often reinforce existing beliefs, limiting exposure to diverse perspectives. The rapid spread of false information can have serious societal consequences."
      }
    ]
  },
  {
    "debate_info": {
      "id": 5,
      "topic": "自動運転車は人間の運転手より安全か？",
      "created_at": "2024-01-20T11:17:05.000Z",
      "role": 1,
      "win_flag": 1
    },
    "debate_texts": [
      {
        "turn_number": 1,
        "sequence_in_turn": 1,
        "text": "Autonomous vehicles reduce accidents caused by human error and fatigue. Machines do not get distracted, drunk, or drowsy. This consistency could drastically lower traffic fatalities."
      },
      {
        "turn_number": 1,
        "sequence_in_turn": 2,
        "text": "They follow traffic laws consistently, improving overall road safety. Unlike humans, AVs don't speed or run red lights. This makes roads more predictable and safer for all users."
      },
      {
        "turn_number": 2,
        "sequence_in_turn": 1,
        "text": "However, current technology struggles with complex and unpredictable situations. Weather conditions, construction zones, and human behavior still pose challenges. Until fully resolved, human oversight remains essential."
      }
    ]
  },
  {
    "debate_info": {
      "id": 6,
      "topic": "ゲームは子供の教育に役立つか？",
      "created_at": "2024-01-25T16:08:50.000Z",
      "role": 1,
      "win_flag": 1
    },
    "debate_texts": [
      {
        "turn_number": 1,
        "sequence_in_turn": 1,
        "text": "Educational games promote critical thinking and problem-solving skills. Games often require strategy, logic, and memory. These cognitive skills are valuable in academic and real-life contexts."
      },
      {
        "turn_number": 1,
        "sequence_in_turn": 2,
        "text": "They can make learning engaging and interactive for children. Unlike traditional lectures, games provide immediate feedback and reward systems. This keeps students motivated and encourages consistent practice."
      },
      {
        "turn_number": 2,
        "sequence_in_turn": 1,
        "text": "Yet, excessive screen time may negatively affect attention spans and social skills. Children may become less active and more isolated. Parents and educators must set healthy boundaries around usage."
      }
    ]
  },
  {
    "debate_info": {
      "id": 7,
      "topic": "プラスチック製品の使用を禁止すべきか？",
      "created_at": "2024-01-30T21:04:12.000Z",
      "role": 1,
      "win_flag": 1
    },
    "debate_texts": [
      {
        "turn_number": 1,
        "sequence_in_turn": 1,
        "text": "Plastic bans help reduce ocean pollution and protect wildlife habitats. Marine animals often mistake plastic for food, leading to injury or death. Banning harmful materials curbs this environmental damage."
      },
      {
        "turn_number": 1,
        "sequence_in_turn": 2,
        "text": "Alternatives like biodegradable materials are becoming more viable. Innovations in packaging and reusable products support this transition. Consumer behavior is gradually adapting to these changes."
      },
      {
        "turn_number": 2,
        "sequence_in_turn": 1,
        "text": "However, some plastic products are essential in medical and food safety fields. Sterility and durability are crucial in certain contexts. A complete ban could have unintended negative effects without proper substitutes."
      }
    ]
  }
];

/**
 * 任意・単一IDのディベート履歴を表示するページ
 * @returns ディベート履歴ページ
 */
const DebateHistoryPage = () => {
  // アカウントID,履歴ID取得
  const {accountId, historyId} = useParams<{ accountId:string, historyId:string }>();
  console.log(`accountId:${accountId} | historyId:${historyId}`);

  // ディベート履歴取得
  // const history = debateHistory(Number(historyId));

  // ダミーデータ
  const history = testHistory.find(h => h.debate_info.id == Number(historyId) )
  
  return(
    <div className="absolute top-5">
      <div className="w-full h-[112px] text-header-l font-bold flex flex-col mb-11">
        {/* ディベートタイトル */}
        <p className="m-auto ml-0 h-[52px] text-[--text-header_primary]">{history?.debate_info.topic}</p>
        {/* ディベート日時 */}
        <p className="m-auto ml-0 h-[52px] text-[--text-header_secondary]">{history?.debate_info.created_at}</p>
      </div>

      {/* ディベート内容 */}
      <section className="flex flex-col gap-[46px]">
        {
          history?.debate_texts.map((t) => {
            return(
              <>
                <div className="text-header-l font-semibold">{`Round${t.turn_number}`}</div>
                <DebateHistory name={""} img="" text={t.text} />
              </>
            )
          })
        }
      </section>
    </div>
  )
}
export default DebateHistoryPage;
