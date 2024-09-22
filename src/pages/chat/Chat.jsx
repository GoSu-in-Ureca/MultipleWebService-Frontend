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
    const { chatId } = useParams();
    const messageEndRef = useRef(null);
    const chatRoomRef = ref(database, `/chatRoom/${chatId}`);
    const [chatRoomName, setChatRoomName] = useState("");
    const reference = ref(database, `/chatRoom/${chatId}/messages`);
    const [messageList, setMessageList] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const [post, setPost] = useState(null);
    const currentUser = auth.currentUser;

    // 현재 사용자 불러오기
    useEffect(() => {
        const queryCollection = query(
            collection(db, "users"),
            where("user_id", "==", currentUser.uid)
        );
        const fetchUser = async () => {
            try {
                const querySnapshot = await getDocs(queryCollection);

                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setUser({ ...userData, id: querySnapshot.docs[0].id });
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    // 관련 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            const queryCollection = query(
                collection(db, "posts"),
                where("post_chatroom_id", "==", chatId)
            );
            try {
                const querySnapshot = await getDocs(queryCollection);

                if (!querySnapshot.empty) {
                    const postData = querySnapshot.docs[0].data();
                    setPost({ ...postData, id: querySnapshot.docs[0].id });
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchPost();
    }, []);

    // Fetch chat room name
    useEffect(() => {
        const unsubscribe = onValue(chatRoomRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.room_name) {
                setChatRoomName(data.room_name);
            }
        });
        return () => unsubscribe();
    }, [chatId]);

    // 메세지 새로고침
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

    // Send message handler
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;

        try {
            const messageRef = push(reference);
            const messageData = {
                senderid: currentUser.uid,
                senderdocid: user.id,
                sendername: currentUser.displayName,
                senderdepartment: user.user_department,
                senderonoffline: user.user_onoffline,
                text: newMessage,
                createdat: new Date().toISOString(),
                senderPhotoURL: currentUser.photoURL,
            };
            await set(messageRef, messageData);

            const chatRoomRef = ref(database, `/chatRoom/${chatId}`);
            await update(chatRoomRef, {
                room_lastMessage: messageData.text,
                room_lastMessagedat: messageData.createdat,
            });

            setNewMessage("");
        } catch (error) {
            console.error("메시지 전송 오류:", error);
        }
    };

    // Profile click handler
    const handleProfileClick = (senderdocid) => {
        navigate(`/user/main/${senderdocid}`);
    };

    // Navigate to post
    const handlePostNavigate = (postdocid) => {
        navigate(`/main/${postdocid}`);
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messageList]);

    // Time format function
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "오후" : "오전";
        const formattedHours = hours % 12 || 12;
        return `${ampm} ${formattedHours}:${minutes}`;
    };

    const handleIntroNavigate = () => {
        navigate(`/chats`);
    };

    return (
        <>
            <Wrapper>
                <FixArea>
                    <Header>
                        <BackButton onClick={handleIntroNavigate} />
                        <Title>채팅</Title>
                    </Header>
                    <PostInfoArea onClick={() => handlePostNavigate(post.id)}>
                        <Tag isexpired={post && new Date(post.post_deadline) >= new Date() ? "모집중" : "마감"}>
                            {post && new Date(post.post_deadline) >= new Date()
                                ? "모집중"
                                : "마감"}
                        </Tag>
                        <PostTitle>{chatRoomName}</PostTitle>
                    </PostInfoArea>
                </FixArea>
                <InitialSystemMessage>
                    <p>새로운 채팅방이 생성됐습니다.</p>
                    <p>
                        운영 정책을 위반한 메세지로 신고 접수 시 사용에 제한이 있을 수
                        있습니다.
                    </p>
                </InitialSystemMessage>
                <MessageList>
                    {messageList.map((message) =>
                        message.senderid === currentUser.uid ? (
                            <MyMessageItem
                                key={message.id}
                                message={message}
                                formatTime={formatTime}
                            />
                        ) : (
                            <OtherMessageItem
                                key={message.id}
                                message={message}
                                formatTime={formatTime}
                                handleProfileClick={handleProfileClick}
                            />
                        )
                    )}
                    <div ref={messageEndRef} />
                </MessageList>
                <MessageInputArea>
                    <MessageInput
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && handleSendMessage()
                        }
                    />
                    <MessageSend src={messagesend} onClick={handleSendMessage} />
                </MessageInputArea>
            </Wrapper>
        </>
    );
};

export default Chat;

// Message 아이템 컴포넌트 분리함

const MyMessageItem = ({ message, formatTime }) => (
    <MyMessageItemWrapper>
        <MyMessageContent>
            <MyMessageBubble>{message.text}</MyMessageBubble>
        </MyMessageContent>
        <MessageSendTime>{formatTime(message.createdat)}</MessageSendTime>
    </MyMessageItemWrapper>
);

const OtherMessageItem = ({
    message,
    formatTime,
    handleProfileClick,
}) => (
    <OtherMessageItemWrapper>
        <MessageProfile
            src={message.senderPhotoURL}
            onClick={() => handleProfileClick(message.senderdocid)}
        />
        <NameAndMessageArea>
            <SenderInfoArea>
                <Name>{message.sendername}</Name>
                <Department>
                    {message.senderdepartment}/{message.senderonoffline}
                </Department>
            </SenderInfoArea>
            <OtherMessageBubble>{message.text}</OtherMessageBubble>
        </NameAndMessageArea>
        <MessageSendTime>{formatTime(message.createdat)}</MessageSendTime>
    </OtherMessageItemWrapper>
);

// Styled components

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
    alt: "Back Button",
})`
    width: 24px;
    height: 24px;
    margin-left: 10px;

    &:hover {
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

    &:hover {
        cursor: pointer;
    }
`;

const Tag = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 20px;
    background-color: ${({ isexpired }) => (isexpired === '마감' ? '#808080' : '#7f52ff')};
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
    margin-bottom: 20px;
`;

const MessageList = styled.div`
    display: flex;
    flex-direction: column;
    width: 350px;
    margin-bottom: 78px;
`;

const MyMessageItemWrapper = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    margin-bottom: 10px;
`;

const MyMessageContent = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 80%;
`;

const MyMessageBubble = styled.div`
    padding: 10px 14px;
    width: fit-content;
    font-size: 10px;
    color: white;
    background-color: #9872ff;
    border-radius: 20px 20px 0 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

const OtherMessageItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin-bottom: 10px;
`;

const MessageProfile = styled.img`
    width: 28px;
    height: 28px;
    border-radius: 28px;
    margin-right: 8px;
    object-fit: cover;

    &:hover {
        cursor: pointer;
    }
`;

const NameAndMessageArea = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 80%;
`;

const SenderInfoArea = styled.div`
    display: flex;
    font-size: 8px;
    justify-content: flex-start;
    margin-bottom: 5px;
`;

const Name = styled.div`
    margin-right: 5px;
`;

const Department = styled.div`
    color: #bcbec0;
`;

const OtherMessageBubble = styled.div`
    padding: 10px 14px;
    width: fit-content;
    font-size: 10px;
    color: black;
    background-color: #f7f7f7;
    border-radius: 20px 20px 20px 0;
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
    width: 300px;
    height: 40px;
    border: 1px solid #d9d9d9;
    border-radius: 21px;
    outline: none;
    padding: 14px 20px;
    font-size: 10px;
    color: black;
`;

const MessageSend = styled.img`
    width: 40px;
`;

