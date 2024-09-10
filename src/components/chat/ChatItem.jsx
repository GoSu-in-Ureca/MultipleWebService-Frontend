import styled from "styled-components";
import more from "/assets/Icon/More.svg";
import profile from "/assets/BG/ProfileExample.svg";

const ChatItem = ({chat}) => {
    return (
        <>
            <Wrapper>
                <ProfileImage />
                <MainArea>
                    <TextArea>
                    <span>{chat.title}</span>
                    </TextArea>
                    <ChatContent>가장 최근 대화 내용</ChatContent>
                </MainArea>
                <InfoArea>
                    <MoreIcon />
                    <LatestTime>2분 전</LatestTime>
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
    width: 100%;
    padding: 23px 0 23px 0;
    border-bottom: 1px solid #F5F5F5;

    &:hover{
        background-color: #FCFCFC;
        cursor: pointer;
    }
`;

const ProfileImage = styled.img.attrs({
    src: profile,
    alt: "Profile Image"
})`
    width: 34px;
    height: 34px;
    border-radius: 34px;
    background-color: gray;
    margin-left: 20px;
    margin-right: 13px;
    align-self: center;
`;

const MainArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const TextArea = styled.div`
    font-size: 13px;
    font-weight: bold;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ChatContent = styled.div`
    font-size: 12px;
    color: #676767;
`;

const InfoArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    margin-left: 20px;
`;

const MoreIcon = styled.img.attrs({
    src: more,
    alt: "More Icon"
})`
    width: 24px;
    height: 24px;
`;

const LatestTime = styled.div`
    font-size: 11px;
    color: #DADADA;
`;
