import styled from "styled-components";
import LevelPic from "/assets/Icon/level4.svg";

const UserStats = () => {
    return (
        <Wrapper>
            <Box>
                <PartyBox>
                    <Party>모집 횟수</Party><PartyNum>12회</PartyNum>
                </PartyBox>
                <JoinBox>
                    <Join>참여 횟수</Join><JoinNum>15회</JoinNum>
                </JoinBox>
            </Box>
                <LevelBox>
                    <LevelLayout>
                        <Level>활동 레벨</Level><LevelNum>Lv.4</LevelNum>
                    </LevelLayout>
                    <LevelGraph></LevelGraph>
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

const Level = styled.span`
    font-size: 13px;
    font-family: 'Pretendard-Medium';
`;

const LevelNum = styled.span`
    font-size: 16px;
    font-family: 'Pretendard-Medium';
`;

const LevelGraph = styled.img.attrs({
    src: LevelPic,
    alt: "levelPic"
})`
    width: 115px;
    position: relative;
    padding-top: 22px;
`;