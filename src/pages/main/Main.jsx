import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationHome from "../../components/main/NavigationHome";
import CategoryList from "../../components/main/CategoryList";
import HotPostList from "../../components/main/HotPostList";
import SortFilter from "../../components/main/SortFilter";
import PostList from "../../components/main/PostList";
import Toggle from "../../components/main/Toggle";
import logo from "/assets/branding/logo.svg"
import upload from "/assets/Icon/UploadButton.svg";

const Main = () => {
    const navigate = useNavigate();
    const [toggleState, setToggleState] = useState(false);

    const handleUploadFormNavigate = () => {
        navigate('/upload');
    }
    const handleLogoClick = () => {
        navigate('/main', {replace: true});
    }

    return (
        <>
            <Wrapper>
                <Logo onClick={handleLogoClick}/>
                <CategoryList />
                <Title>인기 게시글</Title>
                <HotPostList></HotPostList>
                <TotalPostArea>
                    <Title>게시글 목록</Title>
                    <HeadArea>
                        <Toggle toggleState={toggleState} setToggleState={setToggleState}/>
                        <SortFilter />
                    </HeadArea>
                    <PostList toggleState={toggleState}></PostList>
                </TotalPostArea>
            </Wrapper>
            <UploadIcon onClick={handleUploadFormNavigate}/>
            <NavigationHome />
        </>
    );
}

export default Main;

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
`;

const Logo = styled.img.attrs({
    src: logo,
    alt: "Logo Image"
})`
    width : 100px;
    margin-top: 30px;

    &:hover{
        cursor: pointer;
    }
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    align-self: flex-start;
    padding-left: 23px;
`;

const TotalPostArea = styled.div`
    justify-content: flex-start;
    width: 100%;
    margin-top: 30px;
`;

const HeadArea = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: 18px;
    margin-top: 14px;
`;

const UploadIcon = styled.img.attrs({
    src: upload,
    alt: "Upload Button"
  })`
    position: fixed;
    bottom: 128px;
    left: 50%;
    width: 55px;
    height: 55px;
    transform: translateX(120px);

    &:hover{
        cursor: pointer;
    }
  `
