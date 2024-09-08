import React from "react";
import styled from "styled-components";
import UserStats from "../../components/user/UserStats";
import InterestList from "../../components/user/InterestList";
import UploadList from "../../components/user/UploadList";
import Navigation from "../../components/main/Navigation";
import profileExample from "/assets/BG/ProfileExample.svg";

const UserMain = () => {
    return (
        <>
            <Wrapper>
                <Title>마이페이지</Title>
                <ProfileArea>
                    <ProfileImage />
                    <EditProfileButton />
                    <UserName />
                    <Department />
                </ProfileArea>
                <UserStats></UserStats>
                <InterestList></InterestList>
                <UploadList></UploadList>
            </Wrapper>
            <Navigation />
        </>
    );
}

export default UserMain;

// styled components

const Wrapper = styled.div`
    font-family: "Pretendard-Medium";
    width: 390px;
    height: 1800px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 52px;
`;

const ProfileArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-top: 11px;
`;

const ProfileImage = styled.img.attrs({
    src: profileExample,
    alt: "User Profile Example"
})`
    
`;

const EditProfileButton = styled.div`
    
`;

const UserName = styled.div`
    
`;

const Department = styled.div`
    
`;
