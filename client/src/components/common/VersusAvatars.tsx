import { useEffect, useState } from "react";
import testImages from "../../assets/images/test/testImages";
import Avatar from "./Avatar";
import { Account } from "../../types";
import { getAvatarConst } from "../../constants/avatarConst";

const UserCard = ({ img_url }: Pick<Account, "img_url">) => {
  const avatarColor = getAvatarConst(img_url);

  return (
    <figure
      className="max-w-[400px] min-h-[279px] w-[80%] flex-all-center rounded-[12px]"
      style={{ backgroundColor: `var(--surface-avatar-background-avatar_${avatarColor.bgColor})` }}
    >
      <Avatar image={avatarColor.avatar} size="xl" />
    </figure>
  );
};

const conversation: string[] = [
  "Emily: While I understand that technological advancements bring countless benefits to our society, I firmly believe that our increasing dependence on digital devices is eroding our ability to engage in deep, critical thinking and meaningful face-to-face interactions.",
  "James: I appreciate your concern, Emily, but I would argue that technology, rather than diminishing our cognitive abilities, actually expands our access to information and enables us to connect with diverse perspectives from around the world, fostering a more informed and interconnected society.",
  "Emily: That's a fair point, James, yet I worry that the overwhelming volume of information available online often leads to superficial knowledge and constant distraction, preventing individuals from developing the focus required for complex problem-solving and thoughtful reflection.",
  "James: I agree that information overload can be a challenge, but I believe it ultimately comes down to how individuals choose to manage their time and digital habits, and that with proper digital literacy education, people can learn to navigate these tools without sacrificing their capacity for deep thought.",
  "Emily: However, I contend that even with education, the very design of many digital platforms—optimized for engagement and instant gratification—makes it extremely difficult for users to resist the pull of endless scrolling and notifications, which can have detrimental effects on mental health and our collective attention span.",
  "James: Certainly, there are valid concerns regarding persuasive design and its impact on users, but we should also recognize the agency individuals have in setting boundaries and using technology intentionally, as well as the potential for future regulations or ethical design practices to mitigate these negative effects.",
];
type props = {
  img_url?: string;
  opp_url?: string;
};

const VersusAvatars = ({ img_url, opp_url }: props) => {
  // テスト用アニメーション
  const [lineFeed, setLineFeed] = useState(0); // ターン管理
  const wateTime = (seconds: number) =>
    new Promise((resolve) => setTimeout(resolve, seconds));
  const lineFeedManager = async () => {
    const nextLine = () => {
      setLineFeed((prev) => prev + 1);
    };
    await wateTime(3000);

    for (const element of conversation) {
      nextLine();
      await wateTime(3000);
    }
  };

  useEffect(() => {
    lineFeedManager();
  }, []);

  return (
    <section className="flex-all-center flex-col space-y-[30px]">
      <div className="w-full  flex justify-evenly">
        <UserCard img_url={img_url? img_url : "gray.jpg" } />
        <UserCard img_url={opp_url? opp_url : "gray.jpg" } />
      </div>

      {/* 文字のアニメーションは後で修正必要 */}
      <div className="border border-[--border-voice_to_chat] w-full h-[100px] rounded-[12px] px-[12px] py-[16px] relative">
        <div className="overflow-hidden size-full transition">
          {conversation.map((text, index) => {
            return (
              <p
                key={`debateLine-${index}`}
                style={{
                  transform: `translateY(-${lineFeed * 100}%)`,
                  transitionDuration: "300ms",
                }}
              >
                {text}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VersusAvatars;
