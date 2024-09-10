import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import home from "/assets/Icon/notHome.svg";
import notChat from "/assets/Icon/notChat.svg";
import notUser from "/assets/Icon/user.svg";

const NavigationUser = () => {
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    navigate(`/${page}`);
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

        <NavItem onClick={() => handleNavigation("user/main")}>
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
