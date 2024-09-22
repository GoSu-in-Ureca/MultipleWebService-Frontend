import styled from "styled-components";
import more from "/assets/Icon/More.svg";
import { useNavigate } from "react-router-dom";

const ChatItem = ({chatroom}) => {
    const navigate = useNavigate();

    // 시간 포맷 함수
    const getTimeDifference = (createdAt) => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const diff = (now - postDate) / 1000;

        if(diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if(diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        return `${Math.floor(diff / 86400)}일 전`;
    };

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
                    <LatestTime>{getTimeDifference(chatroom.room_lastMessagedat)}</LatestTime>
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
    width: 230px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const InfoArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    width: 50px;
`;

const MoreIcon = styled.img.attrs({
    src: more,
    alt: "More Icon"
})`
    width: 24px;
    height: 24px;

    &:hover{
        cursor: pointer;
    }
`;

const LatestTime = styled.div`
    font-size: 11px;
    color: #DADADA;
`;
