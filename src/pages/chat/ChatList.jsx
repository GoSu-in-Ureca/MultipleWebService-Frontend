import React from "react";
import styled from "styled-components";
import NavigationChat from "../../components/main/NavigationChat";
import ChatItem from "../../components/chat/ChatItem";
import data from "../../postData.json"

const ChatList = () => {

    return (
        <>
            <Wrapper>
                <Title>채팅</Title>
                <ChatListWrapper>
                    {data.map((chatData, index) => (
                        <ChatItem key={index} chat={chatData} />
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
