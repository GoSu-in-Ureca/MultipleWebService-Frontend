import React from "react";
import styled from "styled-components";
import UserStats from "../../components/user/UserStats";
import InterestList from "../../components/user/InterestList";
import UploadList from "../../components/user/UploadList";
import profileExample from "/assets/BG/ProfileExample.svg";
import NavigationUser from "../../components/main/NavigationUser";

const UserMain = () => {
    return (
        <>
            <Wrapper>
                <InfoBox>
                    <Title>마이페이지</Title>
                    <ProfileArea>
                        <ProfileAreaLeft>
                            <ProfileImage />
                            <EditProfileButton >프로필 사진 변경하기</EditProfileButton>
                            <UserName>윤준수</UserName>
                            <Department>프론트엔드/대면</Department>
                            <LogoutButton>로그아웃</LogoutButton>
                        </ProfileAreaLeft>
                        <ProfileAreaRight>
                            <UserStats />
                        </ProfileAreaRight>
                    </ProfileArea>
                </InfoBox>
                <InterestList></InterestList>
                <UploadList></UploadList>
            </Wrapper>
            <NavigationUser />
        </>
    );
}

export default UserMain;

// styled components

const Wrapper = styled.div`
    /* font-family: "Pretendard-Medium"; */
    width: 390px;
    height: 1800px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
`;

const InfoBox = styled.div`
    width: 100%;
    border-bottom: 4px solid #F4F4F4;
    padding: 0px 0px 32px 10px;
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
    justify-content: space-between;
    gap: 30px;
    margin-top: 32px;
`;

const ProfileAreaLeft = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProfileImage = styled.img.attrs({
    src: profileExample,
    alt: "User Profile Example"
})`
    width: 67px;
`;

const EditProfileButton = styled.div`
    font-size: 10px;
    font-family: 'Pretendard-Regular';
    color: #404041;
    margin-top: 12px;
`;

const UserName = styled.div`
    font-size: 20px;
    font-family: 'Pretendard-SemiBold';
    margin-top: 15px;
`;

const Department = styled.div`
    font-size: 10px;
    font-family: 'Pretendard-Regular';
    color: #BCBEC0;
    margin-top: 4px;
`;

const LogoutButton = styled.div`
    width: 62px;
    height: 22px;
    border: 0.5px solid #BCBEC0;
    border-radius: 20px;
    padding: 5px 12px 5px 12px;
    font-size: 9px;
    font-family: 'Pretendard-Regular';
    display: flex;
    justify-content: center;
    align-items: center;
    color: #808284;
    margin-top: 15px;
`;

const ProfileAreaRight = styled.div`
    width: 100%;
`;
