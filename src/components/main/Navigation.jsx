import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import homeIcon from "/assets/Icon/Home.svg";
import homeDisableIcon from "/assets/Icon/HomeDisable.svg";
import chatIcon from "/assets/Icon/Chat.svg";
import chatDisableIcon from "/assets/Icon/ChatDisable.svg";
import userIcon from "/assets/Icon/User.svg";
import userDisableIcon from "/assets/Icon/UserDisable.svg";

const Navigation = () => {

    const [selected, setSelected] = useState("main");
    const navigate = useNavigate();

    const handleNavigation = (page) => {
        setSelected(page);
        navigate(`/${page}`);
      };

      return (
        <Wrapper>
          <NavItem
            onClick={() => handleNavigation("main")}
            isSelected={selected === "main"}
          >
            <NavIcon
              src={selected === "main" ? homeIcon : homeDisableIcon}
              alt="Home Icon"
            />
            <PlainText>홈</PlainText>
          </NavItem>
    
          <NavItem
            onClick={() => handleNavigation("chats")}
            isSelected={selected === "chat"}
          >
            <NavIcon
              src={selected === "chat" ? chatIcon : chatDisableIcon}
              alt="Chat Icon"
            />
            <PlainText>채팅</PlainText>
          </NavItem>
    
          <NavItem
            onClick={() => handleNavigation("user/main")}
            isSelected={selected === "user"}
          >
            <NavIcon
              src={selected === "user" ? userIcon : userDisableIcon}
              alt="User Icon"
            />
            <PlainText>내 정보</PlainText>
          </NavItem>
        </Wrapper>
      );
    };

export default Navigation;

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
`;
