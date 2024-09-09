import React from "react";
import styled from "styled-components";
import Navigation from "../../components/main/Navigation";
import CategoryList from "../../components/main/CategoryList";
import HotPostList from "../../components/main/HotPostList";
import SortFilter from "../../components/main/SortFilter";
import PostList from "../../components/main/PostList";
import logo from "/assets/branding/logo.svg"
import upload from "/assets/Icon/UploadButton.svg";

const Main = () => {
    return (
        <>
            <Wrapper>
                <Logo />
                <CategoryList />
                <Title>인기 게시글</Title>
                <HotPostList></HotPostList>
                <TotalPostArea>
                    <HeadArea>
                        <Title>게시글 목록</Title>
                        <SortFilter />
                    </HeadArea>
                    <PostList></PostList>
                </TotalPostArea>
            </Wrapper>
            <UploadIcon />
            <Navigation />
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
  `
  