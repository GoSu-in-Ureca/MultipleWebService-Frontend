import React from "react";
import styled from "styled-components";
import UploadButton from "../../components/UploadButton";
import Navigation from "../../components/Navigation";
import CategoryList from "../../components/CategoryList";
import HotPostList from "../../components/HotPostList";
import SortFilter from "../../components/SortFilter";
import PostList from "../../components/PostList";
import logo from "/assets/branding/logo.svg"

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
                <UploadButton />
            </Wrapper>
            <Navigation />
        </>
    );
}

export default Main;

// styled components

const Wrapper = styled.div`
    font-family: "Pretendard-Medium";
    width: 390px;
    height: 2000px;
    display: flex;
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    margin-top: 30px;
`;

const HeadArea = styled.div`
    display: flex;
    justify-content: space-between;
`;
