import React from "react";
import styled from "styled-components";
import backbutton from "/assets/Icon/navigate_before.svg";
import { useNavigate } from "react-router-dom";
import UploadMoreItem from "../../components/user/UploadMoreItem";
import NavigationUser from "../../components/main/NavigationUser";
import post from "../../postData.json";


const UserUploadList = () => {
    const navigate = useNavigate();

    const groupByDate = (data) => {
        return post.reduce((acc, post) => {
            if (!data || !Array.isArray(data)) return {};
            const date = post.created_at.split('T')[0];
            if (!date) return acc;
        
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(post);
            return acc;
            }, {});
      };

      const dateFormat = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
            ) {
            return "오늘";
        } 
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        ) {
            return "어제";
        }
            return `${month}.${day}`;
      };
      
      const groupedPosts = Object.entries(groupByDate(post) || {}).sort(
        ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
      );

    const handleIntroNavigate = () => {
        navigate('/user/main');
    }

    return (
        <>
            <Wrapper>
                <Header>
                    <BackButton onClick={handleIntroNavigate}/>
                    <Title>내가 작성한 게시글</Title>
                </Header>
                <MainArea>
                    {groupedPosts.map(([date, posts], index) => (
                    <SectionDivision key={index}>
                        <DateTitle>{dateFormat(date)}</DateTitle>
                        <UploadList>
                        {posts.map((post, index) => (
                            <UploadMoreItem post={post} key={index} />
                        ))}
                        </UploadList>
                    </SectionDivision>
                    ))}
                </MainArea>
            </Wrapper>
            <NavigationUser />
        </>
    );
}

export default UserUploadList;

// style components

const Wrapper = styled.div`
    font-family: "Pretendard-Medium";
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    margin-bottom: 90px;
`

const Header = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 52px;
    margin-bottom: 25px;
`;

const BackButton = styled.img.attrs({
    src: backbutton,
    alt: "Back Button"
})`
    width: 24px;
    height: 24px;
    margin-left: 10px;

    &:hover{
        cursor: pointer;
    }
`;

const MainArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-left: 102px;
`;

const SectionDivision = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 30px;
`;

const DateTitle = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 13px;
    margin-left: 22px;
`;

const UploadList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;
