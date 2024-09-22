import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import messagesend from "/assets/Icon/message-send.svg";
import backbutton from "/assets/Icon/navigate_before.svg";

import { auth, database, db } from "../../firebase";
import { onValue, push, ref, set, update } from "firebase/database";
import { collection, getDocs, query, where } from "firebase/firestore";

const Chat = () => {
    const navigate = useNavigate();
    const {chatId} = useParams();
    const messageEndRef = useRef(null);
    const chatRoomRef = ref(database, `/chatRoom/${chatId}`);
    const [chatRoomName, setChatRoomName] = useState("");
    const reference = ref(database, `/chatRoom/${chatId}/messages`);
    const [messageList, setMessageList] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const currentUser = auth.currentUser;

    // 현재 사용자의 소속 부서 가져오기
    useEffect( () => {
        const queryCollection = query(collection(db, "users"), where("user_id", "==", currentUser.uid));
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(queryCollection);

                if(!querySnapshot.empty){
                    const userData = querySnapshot.docs[0].data();
                    setUser({ ...userData, id: querySnapshot.docs[0].id });
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchUser();
    }, []);

    // 채팅방 이름 불러오기
    useEffect(() => {
        const unsubscribe = onValue(chatRoomRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.room_name) {
                setChatRoomName(data.room_name); // 채팅방 이름 설정
            }
        });
        return () => unsubscribe();
    }, [chatId]);

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

        return () => unsubscribe();
    }, [chatId]);

    // 메시지 전송 핸들러
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return; // 메시지가 비어있을 경우 전송 안 함

        try {
            const messageRef = push(reference); // 새 메시지 위치 참조
            const messageData = {
                senderid: currentUser.uid,
                sendername: currentUser.displayName,
                senderdepartment: user.user_department,
                senderonoffline: user.user_onoffline,
                text: newMessage,
                createdat: new Date().toISOString(),
                senderPhotoURL: currentUser.photoURL,
            };
            await set(messageRef, messageData);

            // 채팅방의 마지막 메시지 필드 업데이트
            const chatRoomRef = ref(database, `/chatRoom/${chatId}`);
            await update(chatRoomRef, {
                room_lastMessage: messageData.text,
                room_lastMessagedat: messageData.createdat,
            });

            setNewMessage(""); // 메시지 전송 후 입력창 초기화
        } catch (error) {
            console.error("메시지 전송 오류:", error);
        }
    };

    // 메세지 전송 시 아래로 스크롤
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    // 시간 포맷 함수
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? "오후" : "오전";
        const formattedHours = hours % 12 || 12;
        return `${ampm} ${formattedHours}:${minutes}`;
    };

    const handleIntroNavigate = () => {
        navigate(`/chats`);
    }

    return (
        <>
            <Wrapper>
                <FixArea>
                    <Header>
                        <BackButton onClick={handleIntroNavigate}/>
                        <Title>채팅</Title>
                    </Header>
                    <PostInfoArea>
                        <Tag>모집중</Tag>
                        <PostTitle>{chatRoomName}</PostTitle>
                    </PostInfoArea>
                </FixArea>
                <InitialSystemMessage>
                    <p>새로운 채팅방이 생성됐습니다.</p>
                    <p>운영 정책을 위반한 메세지로 신고 접수 시 사용에 제한이 있을 수 있습니다.</p>
                </InitialSystemMessage>
                <MessageList>
                    {messageList.map((message) => (
                        <MessageItem key={message.id} isMyMessage={message.senderid === currentUser.uid}>
                            <MessageProfile src={message.senderPhotoURL} isMyMessage={message.senderid === currentUser.uid} />
                            <NameAndMessageArea isMyMessage={message.senderid === currentUser.uid}>
                                <SenderInfoArea>
                                    <Name isMyMessage={message.senderid === currentUser.uid}>{message.sendername}</Name>
                                    <Department isMyMessage={message.senderid === currentUser.uid}>{message.senderdepartment}/{message.senderonoffline}</Department>
                                </SenderInfoArea>
                                <MessageBubble isMyMessage={message.senderid === currentUser.uid}>
                                    {message.text}
                                </MessageBubble>
                            </NameAndMessageArea>
                            <MessageSendTime>{formatTime(message.createdat)}</MessageSendTime>
                        </MessageItem>
                    ))}
                    <div ref={messageEndRef} />
                </MessageList>
                <MessageInputArea>
                    <MessageInput 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <MessageSend src={messagesend} onClick={handleSendMessage}/>
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
    min-height: 100vh;
    background-color: white;
`;

const FixArea = styled.div`
    width: 390px;
    position: fixed;
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

const InitialSystemMessage = styled.div`
    text-align: center;
    font-size: 8px;
    color: #808284;
    line-height: 3px;
    margin-top: 90px;
`;

const MessageList = styled.div`
    display: flex;
    flex-direction: column;
    width: 350px;
    margin-bottom: 78px;
`;

const MessageItem = styled.div`
    display: flex;
    justify-content: "flex-start";
    flex-direction: ${({ isMyMessage }) => (isMyMessage ? "row-reverse" : "row")};
    align-items: flex-end;
    margin-bottom: 10px;
`;

const MessageProfile = styled.img`
    display: ${({isMyMessage}) => ((isMyMessage ? "none" : ""))};
    width: 28px;
    height: 28px;
    border-radius: 28px;
    margin-right: 8px;
`;

const NameAndMessageArea = styled.div`
    display: flex;
    flex-direction: column;
    height: ${({ isMyMessage }) => (isMyMessage ? "32px" : "47px")};
    max-width: 80%;
`;

const SenderInfoArea = styled.div`
    display: flex;
    font-size: 8px;
    justify-content: flex-start;
    margin-bottom: 5px;
`;

const Name = styled.div`
    display: ${({ isMyMessage }) => (isMyMessage ? "none" : "")};
    margin-right: 5px;
`;

const Department = styled.div`
    display: ${({ isMyMessage }) => (isMyMessage ? "none" : "")};
    color: #BCBEC0;
`;

const MessageBubble = styled.div`
    padding: 10px 14px;
    width: fit-content;
    font-size: 10px;
    color: ${({ isMyMessage }) => (isMyMessage ? "white" : "black")};
    background-color: ${({ isMyMessage }) => (isMyMessage ? "#BFA9FF" : "#F7F7F7")};
    border-radius: ${({ isMyMessage }) => (isMyMessage ? "20px 20px 0 20px" : "20px 20px 20px 0")};
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const MessageSendTime = styled.div`
    height: 100%;
    font-size: 8px;
    display: flex;
    align-items: flex-end;
    margin: 0 4px;
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
    background-color: white;
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
