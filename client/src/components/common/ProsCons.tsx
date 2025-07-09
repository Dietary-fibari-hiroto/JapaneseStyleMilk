type propCons = { witch: boolean };
const ProsCons = ({ witch }: propCons) => {
  if (witch) {
    return (
      <div className="w-[60px] h-[38px] bg-[--surface-debate_position_tag] text-[--text-debate_position_text] rounded-[6px] font-bold flex-all-center">
        否定
      </div>
    );
  } else {
    return (
      <div className="w-[60px] h-[38px] bg-[--text-debate_position_text] text-[--surface-debate_position_tag] rounded-[6px] font-bold flex-all-center">
        肯定
      </div>
    );
  }
};

export default ProsCons;
