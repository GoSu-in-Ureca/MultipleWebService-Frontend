import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import messagesend from "/assets/Icon/message-send.svg";
import backbutton from "/assets/Icon/navigate_before.svg";

import { auth, database, db } from "../../firebase";
import { get, onValue, push, ref, set, update } from "firebase/database";
import { arrayRemove, collection, doc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";

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
    const [currentTime, setCurrentTime] = useState(new Date().getDate());
    const isFirstRender = useRef(true);
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

    // 타이틀 동기화
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

    // // 날짜 변경 감지
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         const now = new Date();
    //         const date = now.getDate();
    //         if (date !== currentTime) {
    //             setCurrentTime(date);
    //         }
    //     }, 60000); // 1분마다 체크

    //     return () => clearInterval(timer);
    // }, [currentTime]);
    // // 날짜 변경 시 메시지 전송
    // useEffect(() => {
    //     if (isFirstRender.current) {
    //         isFirstRender.current = false;
    //         return;
    //     }
    //     const dateSystemMessage = async () => {
    //         try{
    //             const messageRef = push(reference);
    //             const messageData = {
    //                 senderid: "system",
    //                 text: `${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    //                 type: "date",
    //                 createdat: new Date().toISOString(),
    //             };
    //             await set(messageRef, messageData);
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     };

    //     dateSystemMessage();
    // }, [currentTime]);

    // 메세지 전송 핸들러
    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (newMessage.trim() === "") return;

        try {
            const messageType = isValidUrl(newMessage.trim()) ? "url" : "text";

            const messageRef = push(reference);
            const messageData = {
                senderid: currentUser.uid,
                senderdocid: user.id,
                sendername: currentUser.displayName,
                senderdepartment: user.user_department,
                senderonoffline: user.user_onoffline,
                text: newMessage,
                type: messageType,
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

    // 채팅방 및 파티 나가기 핸들러
    const handleLeaveChatRoom = async () => {
        try {
            // 현재 채팅방의 참가자 목록
            const chatRoomRef = ref(database, `/chatRoom/${chatId}`);
            const snapshot = await get(chatRoomRef);
            const chatRoomData = snapshot.val();
            let participants = chatRoomData?.room_parti || [];
    
            // 참가자 목록에서 제거
            participants = participants.filter(uid => uid !== currentUser.uid);
    
            // 참가자 목록 업데이트
            await update(chatRoomRef, {
                room_parti: participants,
            });

            // Firestore의 posts 컬렉션에서도 제거하기
            if (post && post.id) {
                const postDocRef = doc(db, "posts", post.id);
          
                await updateDoc(postDocRef, {
                  post_parti_members: arrayRemove(currentUser.uid),
                  post_currentparti: increment(-1), // 현재 인원 수 감소
                  post_status: true,
                });
              } else {
                console.error("게시글 정보를 불러오지 못했습니다.");
              }
    
            // 시스템 메시지 전송
            const messagesRef = ref(database, `chatRoom/${chatId}/messages`);
            const messageRef = push(messagesRef);
            const messageData = {
                senderid: "system",
                text: `${user.user_name}(${user.user_department}/${user.user_onoffline})님이 퇴장하셨습니다.`,
                createdat: new Date().toISOString(),
            };
            await set(messageRef, messageData);
    
            navigate(`/chats`);
        } catch (error) {
            console.error("채팅방 퇴장 중 오류 발생:", error);
            alert("채팅방 퇴장 중 오류가 발생했습니다.");
        }
    };

    const handleProfileClick = (senderdocid) => {
        navigate(`/user/main/${senderdocid}`);
    };

    const handlePostNavigate = (postdocid) => {
        navigate(`/main/${postdocid}`);
    };

    // 브라우저 바닥 스크롤
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
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

    const isValidUrl = (string) => {
        try {
          const url = new URL(string);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
          return false;
        }
      };      

    return (
        <>
            <Wrapper>
                <FixArea>
                    <Header>
                        <BackButton onClick={handleIntroNavigate} />
                        <Title>채팅</Title>
                        <LeaveButton onClick={handleLeaveChatRoom}>나가기</LeaveButton>
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
                    {messageList.map((message) => {
                    const senderId = message.senderid || '';
                    const messageType = message.type || '';

                    if (senderId === 'system') {
                        if (messageType === 'postUpdate') {
                            return (
                                <PostUpdateMessageItem
                                key={message.id}
                                message={message}
                                />
                            );
                        } else if(messageType === 'date') {
                            return (
                                <DateUpdateMessageItem
                                key={message.id}
                                message={message}
                                />
                            )
                        } else {
                        return (
                            <SystemMessageItem
                            key={message.id}
                            message={message}
                            />
                        );
                        }
                    } else if (senderId === currentUser.uid) {
                        return (
                        <MyMessageItem
                            key={message.id}
                            message={message}
                            formatTime={formatTime}
                        />
                        );
                    } else {
                        return (
                        <OtherMessageItem
                            key={message.id}
                            message={message}
                            formatTime={formatTime}
                            handleProfileClick={handleProfileClick}
                        />
                        );
                    }
                    })}
                    <div ref={messageEndRef} />
                </MessageList>
                <MessageInputArea>
                    <form onSubmit={handleSendMessage}>
                        <MessageInput
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                    </form>
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
            {message.type === 'url' ? (
                <MyMessageBubble>
                    <MyMessageLink href={message.text} target="_blank" rel="noopener noreferrer">
                        {message.text}
                    </MyMessageLink>
                </MyMessageBubble>
            ) : (
                <MyMessageBubble>{message.text}</MyMessageBubble>
            )}
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
        <MessageAndTimeArea>
            {message.type === 'url' ? (
                <OtherMessageBubble>
                <OtherMessageLink href={message.text} target="_blank" rel="noopener noreferrer">
                    {message.text}
                </OtherMessageLink>
                </OtherMessageBubble>
            ) : (
                <OtherMessageBubble>{message.text}</OtherMessageBubble>
            )}
            <MessageSendTime>{formatTime(message.createdat)}</MessageSendTime>
        </MessageAndTimeArea>
    </NameAndMessageArea>
</OtherMessageItemWrapper>
);
  

const SystemMessageItem = ({ message }) => (
    <SystemMessageWrapper>
        <SystemMessageText>{message.text}</SystemMessageText>
    </SystemMessageWrapper>
);

const PostUpdateMessageItem = ({ message }) => (
    <PostUpdateMessageWrapper>
        <PostUpdateMessageText>{message.text}</PostUpdateMessageText>
    </PostUpdateMessageWrapper>
);

const DateUpdateMessageItem = ({ message }) => (
    <DateUpdateMessageWrapper>
        <DateUpdateMessageText>{message.text}</DateUpdateMessageText>
    </DateUpdateMessageWrapper>
)

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

const LeaveButton = styled.button`
    margin-left: auto;
    margin-right: 10px;
    background-color: transparent;
    border: none;
    color: #7f52ff;
    font-size: 10px;
    cursor: pointer;

    &:hover {
        cursor: pointer;
    }
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
    margin-right: 21px;
`;

const InitialSystemMessage = styled.div`
    text-align: center;
    font-size: 9px;
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

// 본인 메세지
const MyMessageItemWrapper = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
    margin: 10px 0 0 0;
`;

const MyMessageContent = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 80%;
`;

const MyMessageBubble = styled.div`
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 400;
    color: white;
    background-color: #9872ff;
    border-radius: 20px 20px 0 20px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    word-break: break-all;
`;

const MyMessageLink = styled.a`
  color: white;
  word-break: break-all;
  white-space: normal;
`;

// 다른 사람 메세지
const OtherMessageItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    margin: 15px 0 5px 0;
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
    gap: 3px;
`;

const SenderInfoArea = styled.div`
    display: flex;
    font-size: 8px;
    justify-content: flex-start;
    margin-bottom: 5px;
`;

const MessageAndTimeArea = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
`

const Name = styled.div`
    margin-right: 5px;
    font-size: 10px;
`;

const Department = styled.div`
    color: #bcbec0;
    font-size: 10px;
`;

const OtherMessageBubble = styled.div`
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 400;
    color: black;
    background-color: #f7f7f7;
    border-radius: 20px 20px 20px 0;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    word-break: break-all;
`;

const OtherMessageLink = styled.a`
  color: black;
  word-break: break-all;
  white-space: normal;
`;

const MessageSendTime = styled.div`
    height: 100%;
    font-size: 8px;
    color: #808284;
    display: flex;
    align-items: flex-end;
    margin: 0 4px;
    white-space: nowrap;
`;

const PostUpdateMessageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 15px 0;
`;

const PostUpdateMessageText = styled.div`
    font-size: 8px;
    color: #ff0d0d;
    font-weight: 400;
    background-color: #FFDBDB;
    border-radius: 9px;
    padding: 4px 14px;
`;

const DateUpdateMessageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 15px 0;
`;

const DateUpdateMessageText = styled.div`
    font-size: 8px;
    color: #6F6F6F;
    font-weight: bold;
    background-color: #F7F7F7;
    border-radius: 9px;
    padding: 4px 12px;
`;

// 시스템 메세지
const SystemMessageWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 15px 0;
`;

const SystemMessageText = styled.div`
    font-size: 9px;
    color: #BFA9FF;
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
