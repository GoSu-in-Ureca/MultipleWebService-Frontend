import styled from "styled-components";
import more from "/assets/Icon/More.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import ChatListModal from "../../components/main/ChatListModal.jsx";

const ChatItem = ({chatroom}) => {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [leftDays, setLeftDays] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // 모달 창
    const [modalPosition, setModalPosition] = useState({top:0, left:0}); // 모달 위치

    const modalButtonRef = useRef(null); // 미트볼 아이콘 위치 참조

    // 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const queryCollection = query(collection(db, "posts"), where("post_chatroom_id", "==", chatroom.room_id));
                const postSnapshot = await getDocs(queryCollection);

                if(!postSnapshot.empty) {
                    const postData = postSnapshot.docs[0].data();
                    setPost({ ...postData, id: postSnapshot.docs[0].id });

                    // 마감일 계산
                    const deadline = new Date(postData.post_deadline);
                    const now = new Date();
                    const difference = (deadline - now) / (1000 * 60 * 60 * 24);

                    // D-day 계산 결과 저장
                    setLeftDays(difference >= 0 ? Math.floor(difference) : "마감");
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchPost();
    }, [chatroom]);

    // 시간 포맷 함수
    const getTimeDifference = (createdAt) => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const diff = (now - postDate) / 1000; // 초 단위 차이
    
        if (diff < 60) return `${Math.floor(diff)}초 전`; // 60초 미만
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`; // 60분 미만
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`; // 24시간 미만
        if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`; // 30일 미만
        if (diff < 31104000) return `${Math.floor(diff / 2592000)}달 전`; // 12달 미만
        return `${Math.floor(diff / 31104000)}년 전`; // 1년 이상
    };

    // 개별 채팅방으로 이동
    const handleChatRoomNavigate = () => {
        navigate(`/chats/${chatroom.room_id}`);
    }

    // 모달 위치 설정
    const handleModalClick = () => {
        const rect = modalButtonRef.current.getBoundingClientRect();
        setModalPosition({top: rect.top, left: rect.left+window.scrollX}); // 모달 위치
        setIsOpen(true); // 모달 열기
        console.log('modal: '+isOpen);
        document.body.style.overflow = 'hidden';
    }

    

    return (
        <>
            <Wrapper onClick={()=>handleChatRoomNavigate()

            }>
                <ThumbnailImage src={chatroom.room_thumbnail}/>
                <MainArea>
                    <TextArea>
                        <DayItem $isexpired={leftDays === '마감'}>{leftDays === "마감" ? "마감" : `D-${leftDays}`}</DayItem>
                        <Title>{chatroom.room_name}</Title>
                    </TextArea>
                    <ChatContent>{chatroom.room_lastMessage}</ChatContent>
                </MainArea>
                <InfoArea>
                    <MoreIconLayout
                        onClick={(e)=>{e.stopPropagation()}}
                    >
                        <MoreIcon 
                            ref={modalButtonRef}
                            onClick={handleModalClick} // 클릭 시 모달 열기
                        />
                        <ChatListModal 
                            post={post}
                            chatId={chatroom.room_id}
                            isOpen={isOpen} 
                            onClose={()=>{
                                setIsOpen(false);
                                document.body.style.overflow = 'unset';
                            }}
                            modalPosition={modalPosition} // 모달 위치 props 전달
                        />
                    </MoreIconLayout>
                    <LatestTime>{getTimeDifference(chatroom.room_lastMessagedat)}</LatestTime>
                </InfoArea>
            </Wrapper>
        </>
    );

}

export default ChatItem;

// styled components

const Wrapper = styled.div`
    display: flex;
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
    gap: 5px;
`;

const TextArea = styled.div`
    display: flex;
    font-size: 13px;
    align-items: center;
`;

const Title = styled.div`
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
    margin-left: 9px;
`;

const DayItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 9px;
    font-weight: 400;
    color: white;
    padding: 3px 9px 3px 9px;
    border: 1px solid ${(props) => (props.$isexpired ? "#808080" : "#7f52ff")};
    border-radius: 19.5px;
    background-color: ${(props) => (props.$isexpired ? "#808080" : "#7f52ff")};
`;

const ChatContent = styled.div`
    font-size: 12px;
    font-weight: 400;
    color: #676767;
    width: 250px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 2px;
`;

const InfoArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    width: 50px;
`;

const MoreIconLayout = styled.div`
    display: flex;
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
    font-weight: 400;
    color: #DADADA;
`;
