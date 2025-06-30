import testImages from "../../assets/images/test/testImages";
import Avatar from "./Avatar";

const UserCard = () => {
  return (
    <figure className="w-[400px] h-[279px] flex-all-center bg-[--surface-avatar-background-avatar_yellow] rounded-[12px]">
      <Avatar image={testImages.IMG_7009_Enhanced_NR} size="xl" />
    </figure>
  );
};

const VersusAvatars = () => {
  return (
    <section className="flex-all-center flex-col space-y-[30px]">
      <div className="w-full  flex justify-evenly">
        <UserCard />
        <UserCard />
      </div>
      <div className="border border-[--border-voice_to_chat] w-full h-[100px] rounded-[12px]"></div>
    </section>
  );
};

export default VersusAvatars;
