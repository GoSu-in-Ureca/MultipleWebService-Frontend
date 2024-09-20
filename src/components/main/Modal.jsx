import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// isOpen : 모달 열려있는지 여부
// onClose : 모달 닫기
// children : 모달 안에 들어갈 내용

const Modal = ({isOpen, onClose, modalPosition, postId}) => {
  const navigate = useNavigate();

  if(!isOpen) return null;

  // 게시글 수정
  const handleUpdateClick = () => {
    navigate(`/update/${postId}`);
  };

  // 게시글 삭제
  const handleDeleteClick = async () => {
    try{
      await deleteDoc(doc(db, 'posts', postId));
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

      window.location.reload();
    } catch (error) {
      console.log(error);
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
        <DelButton onClick={handleDeleteClick}>삭제</DelButton>
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
`;

const DelButton = styled.div`
  cursor: pointer;
  border: 0;
  padding: 10px 20px 10px 20px;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
`;

const EndButton = styled.div`
  cursor: pointer;
  border: 0;
  padding: 10px 15px 15px 15px;
`;