import PrimaryButton from "../components/common/PrimaryButton";
import SectionHeader from "../components/common/SectionHeader";

const Test2 = () => {
  const userName = "山田";
  return (
    <div className="flex flex-col space-y-2 w-full h-full">
      {/* SectionHeader */}
      <SectionHeader mode="anime" />
      <PrimaryButton size="Large" color="Disabled" shape="Round" label="test" /> 
    </div>
  );
};

export default Test2;
