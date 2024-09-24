import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { database, db } from '../../firebase';
import { ref, remove } from 'firebase/database';
import { ref as databaseRef, push, set } from 'firebase/database';

// isOpen : 모달 열려있는지 여부
// onClose : 모달 닫기
// children : 모달 안에 들어갈 내용

const Modal = ({isOpen, onClose, modalPosition, postId, post}) => {
  const navigate = useNavigate();

  if(!isOpen) return null;

  // 게시글 수정
  const handleUpdateClick = async () => {
    await sendSystemMessage("게시글이 수정되었습니다.");
    onClose();
    navigate(`/update/${postId}`);
  };

  // 게시글 삭제
  const handleDeleteClick = async () => {
    try{
      await deleteDoc(doc(db, 'posts', postId));

      await remove(ref(database, `chatRoom/${post.post_chatroom_id}`));

      await sendSystemMessage("작성자에 의해 모집이 삭제되었습니다.");
      onClose();

      alert('게시글이 성공적으로 삭제되었습니다!');
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  // 게시글 강제 마감
  const formatDate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };
  const handleDeadlineClick = async () => {
    try {
      const postDocRef = doc(db, "posts", postId);

      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);

      await updateDoc(postDocRef, {
        post_deadline: formattedDate,
        post_status: false,
      });

      await sendSystemMessage("작성자에 의해 모집이 마감되었습니다.");
      onClose();

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // 시스템 메시지 전송
  const sendSystemMessage = async (messageText) => {
    try {
      const chatRoomId = post.post_chatroom_id;
      const messagesRef = databaseRef(database, `chatRoom/${chatRoomId}/messages`);
      const messageRef = push(messagesRef);
      const messageData = {
        senderid: "system",
        text: messageText,
        createdat: new Date().toISOString(),
        type: "postUpdate",
      };
      await set(messageRef, messageData);
    } catch (error) {
      console.error(error);
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
        <UpdateButton onClick={handleUpdateClick}>수정</UpdateButton>
        <DivisionLine />
        <DelButton onClick={handleDeleteClick}>삭제</DelButton>
        <DivisionLine />
        <EndButton onClick={handleDeadlineClick}>모집 마감</EndButton>
      </ModalBox>
    </ModalOverlay>
  );
};

export default Modal;

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

const UpdateButton = styled.div`
  cursor: pointer;
  border: 0;
  padding: 15px 15px 10px 15px;
  width: 80%;
  text-align: center;
`;

const DelButton = styled.div`
  cursor: pointer;
  border: 0;
  padding: 10px 15px;
`;

const EndButton = styled.div`
  cursor: pointer;
  border: 0;
  padding: 10px 15px 15px 15px;
`;

const DivisionLine = styled.hr`
  width: 70%;
  height: 1px;
  background-color: #e9e9e9;
  border: 0;
  margin: 0;
`;
