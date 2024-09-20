import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import messagesend from "/assets/Icon/message-send.svg";
import backbutton from "/assets/Icon/navigate_before.svg";

import { database } from "../../firebase";
import { onValue, ref } from "firebase/database";

const Chat = () => {
    const navigate = useNavigate();
    const {chatId} = useParams();
    const reference = ref(database, `/chats/${chatId}`);
    const [messageList, setMessageList] = useState([]); // 메시지 목록 상태
    const [newMessage, setNewMessage] = useState("");

    // 채팅방의 메시지를 실시간으로 불러오기
    useEffect(() => {
        const unsubscribe = onValue(reference, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const messageArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setMessageList(messageArray);
            }
        });

        return () => unsubscribe(); // Cleanup on component unmount
    }, [chatId]);

    // 메시지 전송 핸들러
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return; // 메시지가 비어있을 경우 전송 안 함

        try {
            const messageRef = push(reference); // 새 메시지 위치 참조
            await messageRef.set({
                senderId: "currentUserId", // 현재 사용자 ID, 실제로는 Firebase Auth에서 가져와야 함
                text: newMessage,
                createdAt: new Date().toISOString(),
            });

            setNewMessage(""); // 메시지 전송 후 입력창 초기화
        } catch (error) {
            console.error("메시지 전송 오류:", error);
        }
    };

    const handleIntroNavigate = () => {
        navigate(-1);
    }

    return (
        <>
            <Wrapper>
                <Header>
                    <BackButton onClick={handleIntroNavigate}/>
                    <Title>채팅</Title>
                </Header>
                <PostInfoArea>
                    <Tag>모집중</Tag>
                    <PostTitle>노트북 거치대 공동구매 하실 분</PostTitle>
                </PostInfoArea>
                <MessageList>

                </MessageList>
                <MessageInputArea>
                    <MessageInput />
                    <MessageSend src={messagesend}/>
                </MessageInputArea>
            </Wrapper>
        </>
    );
}

export default Chat;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 390px;
    height: 100vh;
    background-color: white;
`;

const Header = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 52px;
`;

const BackButton = styled.img.attrs({
    src: backbutton,
    alt: "Back Button"
})`
    width: 24px;
    height: 24px;
    margin-left: 10px;

    &:hover{
        cursor: pointer;
    }
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-left: 140px;
`;

const PostInfoArea = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 38px;
`;

const Tag = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 20px;
    background-color: #7F52FF;
    border-radius: 20px;
    color: white;
    font-weight: 400;
    font-size: 10px;
    margin-left: 21px;
`;

const PostTitle = styled.div`
    font-size: 13px;
    font-weight: bold;
    margin-left: 9px;
`;

const MessageList = styled.div`
    display: flex;
    flex-direction: column;
`;

const MessageInputArea = styled.div`
    width: 390px;
    height: 78px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: fixed;
    bottom: 0px;
`;

const MessageInput = styled.input.attrs({
    placeholder: "메세지를 입력해주세요",
})`
    display: flex;
    
    width: 300px;
    height: 40px;
    border: 1px solid #D9D9D9;
    border-radius: 21px;
    outline: none;
    padding: 14px 20px;
    font-size: 10px;
    color: black;
`;

const MessageSend = styled.img`
    width: 40px;
`;
