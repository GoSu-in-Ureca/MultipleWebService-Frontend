import styled from "styled-components";
import more from "/assets/Icon/More.svg";

const ChatItem = ({chat}) => {
    return (
        <>
            <Wrapper>
                <ProfileImage />
                <MainArea>
                    <Title>{chat.title}</Title>
                    <ChatContent>가장 최근 대화 내용</ChatContent>
                </MainArea>
                <InfoArea>
                    <MoreIcon />
                    <LatestTime></LatestTime>
                </InfoArea>
            </Wrapper>
        </>
    );

}

export default ChatItem;

// styled components

const Wrapper = styled.div`
    display:  flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 390px;
    padding: 23px 20px;
    border-bottom: 1px solid #F5F5F5;

    &:hover{
        background-color: #FCFCFC;
    }
`;

const ProfileImage = styled.img.attrs({

})`
    width: 34px;
    height: 34px;
    border-radius: 34px;
    background-color: gray;
    margin-right: 13px;
    align-self: center;
`;

const MainArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Title = styled.div`
    font-size: 13px;
    font-weight: bold;
`;

const ChatContent = styled.div`
    font-size: 12px;
    color: #676767;
`;

const InfoArea = styled.div`
    display: flex;
    flex-direction: column;
`;

const MoreIcon = styled.img.attrs({
    src: more,
    alt: "More Icon"
})`
    width: 24px;
    height: 24px;
`;

const LatestTime = styled.div`
    
`;
