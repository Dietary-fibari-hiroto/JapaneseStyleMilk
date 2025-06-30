// import PrimaryButton from "../components/common/PrimaryButton";
// import UserCard from "../components/common/UserCard";
import SectionHeader from "../components/common/SectionHeader";

const Test2 = () => {
  const userName = "山田";
  return (
    <div className="flex flex-col space-y-2 w-full h-full">
      {/* SectionHeader */}
      {/* <SectionHeader mode="single" name={userName}/>
      <div id="line for debag" className="w-full h-0 border border-black border-dotted"></div> */}
      <SectionHeader mode="anime" />
    </div>
  );
};

export default Test2;
