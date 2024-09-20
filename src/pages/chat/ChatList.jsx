import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NavigationChat from "../../components/main/NavigationChat";
import ChatItem from "../../components/chat/ChatItem";

import { ref, onValue } from "firebase/database";
import { database } from "../../firebase";

const ChatList = () => {
    const [chatRooms, setChatRooms] = useState([]);

    // 채팅 목록 불러오기
    useEffect(() => {
        const chatRoomsRef = ref(database, "chatRooms");
        const unsubscribe = onValue(chatRoomsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const roomsArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setChatRooms(roomsArray);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <Wrapper>
                <Title>채팅</Title>
                <ChatListWrapper>
                    {chatRooms.map((chatroom, index) => (
                        <ChatItem key={index} chatroom={chatroom} />
                    ))}
                </ChatListWrapper>
            </Wrapper>
            <NavigationChat />
        </>
    );
}

export default ChatList;

// styled components

const Wrapper = styled.div`
    font-family: "Pretendard-Medium";
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    margin-bottom: 90px;
`;

const Title = styled.div`
    width: 100%;
    height: 52px;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ChatListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    width: 100%;
`;
