import Avatar from "../../common/Avatar";

type Props = {
  name: string;
  text: string;
  img: string;
};
const DebateHistory = ({ name, text, img }: Props) => {
  return (
    <div className="w-[781px] min-h-[144px] flex justify-start space-x-[20px]">
      <figure>
        <Avatar image={img} size={"regular"} />
      </figure>
      <div className="space-y-[8px] text-start">
        <p className="text-header-r">{name}</p>
        <p className="text-body-r w-[705px]">{text} </p>
      </div>
    </div>
  );
};

export default DebateHistory;
