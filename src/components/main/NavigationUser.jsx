import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import home from "/assets/Icon/notHome.svg";
import notChat from "/assets/Icon/notChat.svg";
import notUser from "/assets/Icon/user.svg";

import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const NavigationUser = () => {
  const navigate = useNavigate();
  const [userDocId, setUserDocId] = useState(null);

  // 현재 로그인한 사용자의 UID fetch
  useEffect(() => {
    const fetchUserDocId = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const usersCollection = collection(db, "users");
          const q = query(usersCollection, where("user_id", "==", user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            setUserDocId(doc.id);
          } else {
            console.log("사용자 문서를 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("사용자 문서를 불러오는 중 오류 발생:", error);
        }
      }
    };

    fetchUserDocId();
  }, []);

  // 페이지 이동 핸들러
  const handleNavigation = (page) => {
    if (page === "user" && userDocId) {
      navigate(`/user/main/${userDocId}`); // 사용자 페이지로 이동
    } else {
      navigate(`/${page}`); // 그 외의 페이지로 이동
    }
  };

  return (
    <>
      <Wrapper>
        <NavItem onClick={() => handleNavigation("main")}>
          <NavIcon src={home} alt="Home Icon" />
          <PlainText>홈</PlainText>
        </NavItem>

        <NavItem onClick={() => handleNavigation("chats")}>
          <NavIcon src={notChat} alt="Chat Icon" />
          <PlainText>채팅</PlainText>
        </NavItem>

        <NavItem onClick={() => handleNavigation("user")}>
          <NavIcon src={notUser} alt="User Icon" />
          <PlainText>내 정보</PlainText>
        </NavItem>
      </Wrapper>
    </>
  );
};

export default NavigationUser;

// styled components

const Wrapper = styled.nav`
  position: fixed;
  top: calc(100vh - 90px);
  width: 390px;
  height: 90px;
  display: flex;
  background-color: white;
  box-shadow: 0px -4px 10px -4px rgba(0, 0, 0, 0.1);
  justify-content: space-around;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 18px;
  margin-bottom: 9px;
  cursor: pointer;
`;

const NavIcon = styled.img`
  width: 29px;
  height: 29px;
`;

const PlainText = styled.div`
  font-size: 13px;
  font-weight: bold;
  margin-top: 9px;
  color: #000;
`;
