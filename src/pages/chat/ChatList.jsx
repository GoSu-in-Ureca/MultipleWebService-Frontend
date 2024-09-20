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
        const chatRoomsRef = ref(database, "chatRoom");
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

    const sortedData = chatRooms.sort((a, b) => 
        new Date(b.room_createdat) - new Date(a.room_createdat)
    );

    return (
        <>
            <Wrapper>
                <Title>채팅방 목록</Title>
                <ChatListWrapper>
                    {sortedData.map((chatroom, index) => (
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
