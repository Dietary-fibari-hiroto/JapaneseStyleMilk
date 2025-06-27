type Props = {
  text: string;
};
const VoiceToChat = ({ text }: Props) => {
  return (
    <div className="border border-[--border-voice_to_chat] w-[820px] min-h-[96px] flex justify-start items-start text-start p-[12px]"></div>
  );
};

export default VoiceToChat;
