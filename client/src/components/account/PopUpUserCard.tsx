import { useState } from "react";
import ImagesRoute from "../../assets/images/ImagesRoute";
import ThemeButton from "../common/ThemeButton";
const testItem = { name: "山田ジョン", rank: "ゴールドランク", level: 1 };

/**props
 * でユーザー情報を受け取る仕様する予定
 */

type AccountProps = {
  accountIcon: string;
  accountName: string;
  rank: string;
  level: number;
};
const PopUpUserCard = () => {
  const [naightMode, setNightMode] = useState(false);
  return (
    <div className="w-[248px] h-[220px] bg-[--surface-account_pop_up_card] rounded-[16px] flex flex-col items-center justify-between py-[24px]">
      <section className="horizontal-element bg-[--surface-user_profile] h-[78px] ">
        <div className="flex justify-start items-center space-x-[12px]">
          {" "}
          <img
            className="size-[44px] flex flex-shrink-0 rounded-[50%] "
            src={ImagesRoute.avatar_large_pink}
          />
          <div className={` space-y-[4px] close-hidden`}>
            <p className={`font-bold `}>{testItem.name}</p>
            <p>
              {testItem.rank}
              Lv.{testItem.level}
            </p>
          </div>
        </div>
      </section>
      <section className="space-y-[8px]">
        <ThemeButton
          title="ライトモード"
          img={ImagesRoute.light_mode_icon}
          mode={!naightMode}
          onClick={() => setNightMode(false)}
        />
        <ThemeButton
          title="ダークモード"
          img={ImagesRoute.dark_mode_icon}
          mode={naightMode}
          onClick={() => setNightMode(true)}
        />
      </section>
    </div>
  );
};

export default PopUpUserCard;
