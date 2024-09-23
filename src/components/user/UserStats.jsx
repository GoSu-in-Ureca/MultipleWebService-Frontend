import styled from "styled-components";
import toolTip from '/assets/Icon/tool-tip.svg';

const UserStats = ({user}) => {
    return (
        <Wrapper>
            <Box>
                <PartyBox>
                    <Party>모집 횟수</Party><PartyNum>{user.user_recruit}회</PartyNum>
                </PartyBox>
                <JoinBox>
                    <Join>참여 횟수</Join><JoinNum>{user.user_join}회</JoinNum>
                </JoinBox>
            </Box>
                <LevelBox>
                    <LevelLayout>
                        <LevelAndTooltip>
                            <Level>활동 레벨</Level>
                            <TooltipInfo>
                                <ToolTipIcon></ToolTipIcon>
                                <ToolTip>
                                    <p style={{fontSize: "10px", fontWeight: "bold"}}>활동 레벨이란?</p>
                                    <p style={{fontSize: "9px"}}>파티 모집 횟수와 참여 횟수에 따라 책정된 레벨입니다.</p>
                                </ToolTip>
                            </TooltipInfo>
                        </LevelAndTooltip>
                        <LevelNum>LV.{user.user_level}</LevelNum>
                    </LevelLayout>
                    <LevelGraph src={`/assets/Icon/level${user.user_level}.svg`}></LevelGraph>
                </LevelBox>
        </Wrapper>
    );
}

export default UserStats;

// styled components

const Wrapper = styled.div`
 
`;

const Box = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 34px;
`;

const PartyBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
`;

const Party = styled.span`
    font-size: 13px;
    font-family: 'Pretendard-Medium';
`;

const PartyNum = styled.span`
    font-size: 20px;
    font-family: 'Pretendard-Medium';
`;

const JoinBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
`;

const Join = styled.span`
    font-size: 13px;
    font-family: 'Pretendard-Medium';
`;

const JoinNum = styled.span`
    font-size: 20px;
    font-family: 'Pretendard-Medium';
    `;

const LevelBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    `;

const LevelLayout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: absolute;
`;

const LevelAndTooltip = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Level = styled.span`
    font-size: 13px;
    font-family: 'Pretendard-Medium';
`;


const TooltipInfo = styled.div`
    cursor: pointer;
    &:hover > div {
        visibility: visible;
        opacity: 1;
    }  
`;

const ToolTipIcon = styled.img.attrs({
    src: toolTip,
    alt: "tool-tip Image"
})`
    width: 11px;
    height: 11px;
`;

const ToolTip = styled.div`
    visibility: hidden;
    font-size: 0.8vw;
    width: 135px;
    background-color: white;
    color: black;
    border-radius: 10px;
    padding: 7px 10px;
    position: absolute;
    left: 50%;
    opacity: 0;
    transition: opacity 0.3s;
    display: flow;
    z-index: 2;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    

    &::after {
        content: "";
        position: absolute;
        transform: translateX(-50%);
        border-width: 0.6vw;
        border-style: solid;
        border-color: white transparent transparent transparent;
    }
`;

const LevelNum = styled.span`
    font-size: 16px;
    font-family: 'Pretendard-Medium';
`;

const LevelGraph = styled.img`
    width: 115px;
    /* position: relative; */
    padding-top: 22px;
`;