import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { doc, updateDoc, arrayRemove, collection, getDocs, increment, query, where } from 'firebase/firestore';
import { auth, database, db } from '../../firebase';
import { ref, get, update } from 'firebase/database';
import { ref as databaseRef, push, set } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';

// isOpen : 모달 열려있는지 여부
// onClose : 모달 닫기
// children : 모달 안에 들어갈 내용

const ChatListModal = ({isOpen, onClose, modalPosition, post, chatId}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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

  if(!isOpen) return null;



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

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox
        style={{
          position: "absolute",
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
        }}>
        {/* children */}
        <DelButton onClick={handleLeaveChatRoom}>나가기</DelButton>
      </ModalBox>
    </ModalOverlay>
  );
};

export default ChatListModal;

const ModalOverlay = styled.div`
  /* visibility: hidden; */
  position : fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: inset;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DelButton = styled.div`
  cursor: pointer;
  border: 0;
  padding: 10px 15px;
  font-size: 12px;
`;
