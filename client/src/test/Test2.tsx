import { UpgradeCard } from "../components";
import PrimaryButton from "../components/common/PrimaryButton";
import SectionHeader from "../components/common/SectionHeader";

const Test2 = () => {
  const userName = "山田";
  return (
    <div className="flex flex-col space-y-2 w-full h-full">
      <UpgradeCard isOpen={true}/>
    </div>
  );
};

export default Test2;
