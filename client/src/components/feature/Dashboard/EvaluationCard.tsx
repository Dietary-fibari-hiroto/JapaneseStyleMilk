import styled from "styled-components";
import Avatar from "../../common/Avatar";

const CardContainer = styled.button<{}>`
  width: 567px;
  height: 120px;
  background: var(--border-evaluation_card-red);
  border-radius: 8px;
  display: flex;
  justify-content: end;
  .container {
    width: 563px;
    height: 120px;
    background: var(--surface-debate_evaluation_card);
    border-radius: 8px;
    padding: 24px;
    display: flex;
    justify-content: space-between;

    flex-direction: column;
    &:hover {
      background: var(--surface-debate_evaluation_card_hover);
    }
  }
`;

type Props = {
  //ディベート内容
  debateTitle: string;
  //1人目のユーザーの画像
  userImg1: string;
  //二人目のユーザーの画像
  userImg2: string;
  //日付
  date: string;
};
const EvaluationCard = ({ debateTitle, userImg1, userImg2, date }: Props) => {
  return (
    <CardContainer>
      <div className="container">
        <div className="flex justify-between">
          <figure className="relative w-[48px]">
            <div className="absolute left-0 z-[3] size-[32px] overflow-hidden rounded-full  bg-black">
              {" "}
              <Avatar image={userImg1} size="mini" />
            </div>{" "}
            <div className="absolute right-0 z-[3] size-[32px] overflow-hidden rounded-full  bg-black">
              {" "}
              <Avatar image={userImg2} size="mini" />
            </div>{" "}
          </figure>
          <p className="text-header-xxs text-medium ">{date}</p>
        </div>
        <p className="text-start text-header-xs txet-medium">{debateTitle}</p>
      </div>
    </CardContainer>
  );
};

export default EvaluationCard;
