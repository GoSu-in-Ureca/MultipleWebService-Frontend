import styled from "styled-components";
import more from "/assets/Icon/More.svg";
import { useNavigate } from "react-router-dom";

const ChatItem = ({chatroom}) => {
    const navigate = useNavigate();

    // 개별 채팅방으로 이동
    const handleChatRoomNavigate = () => {
        navigate(`/chats/${chatroom.room_id}`);
    }

    return (
        <>
            <Wrapper onClick={handleChatRoomNavigate}>
                <ThumbnailImage src={chatroom.room_thumbnail}/>
                <MainArea>
                    <TextArea>
                    <span>{chatroom.room_name}</span>
                    </TextArea>
                    <ChatContent>{chatroom.room_lastMessage}</ChatContent>
                </MainArea>
                <InfoArea>
                    <MoreIcon />
                    <LatestTime>{chatroom.room_lastMessageat}</LatestTime>
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
        background-color: #F7F7F7;
        cursor: pointer;
    }
`;

const ThumbnailImage = styled.img`
    width: 34px;
    height: 34px;
    border-radius: 34px;
    background-color: gray;
    margin-left: 20px;
    margin-right: 13px;
    object-fit: cover;
    object-position: center;
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
