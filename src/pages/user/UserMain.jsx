import React, { useState, useEffect } from "react";
import styled from "styled-components";
import UserStats from "../../components/user/UserStats";
import InterestList from "../../components/user/InterestList";
import UploadList from "../../components/user/UploadList";
import Loading from "../../Loading";
import NavigationUser from "../../components/main/NavigationUser";
import { useNavigate, useParams } from 'react-router-dom';

import { auth, db, storage } from "../../firebase";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserMain = () => {
    const navigate = useNavigate();
    const {userDocId} = useParams();
    const [user ,setUser] = useState(null);
    const [showSecessionModal, setShowSecessionModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");

    // 사용자 정보 불러오기
    useEffect(() => {
        const fetchUser = async () => {
            try{
                const userRef = doc(db, "users", userDocId);
                const userSnapshot = await getDoc(userRef);

                if(userSnapshot.exists){
                    setUser(userSnapshot.data());
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchUser();
    },[userDocId]);

    // 데이터 로딩 중 처리
    if (!user) {
        return <Loading />;
      }

    const handleLogout = async () => {
        try {
          await signOut(auth);
          navigate("/intro");
          console.log('Success to Logout');
        } catch (error) {
          console.error(error);
        }
      };

      const handleSecessionAlert = () => {
        setShowSecessionModal(true);
      };
      const handleSecessionCancel = () => {
        setShowSecessionModal(false);
      };

      const handleSecessionClick = async () => {
        setShowSecessionModal(false);
        setShowPasswordModal(true);
        
      };
      const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };
      const handlePasswordSubmit = async () => {
        const user = auth.currentUser;

        if(!user){
            return;
        }

        try {
            // 사용자 재인증 우선 진행
            const credential = EmailAuthProvider.credential(auth.currentUser.email, password);

            // 자격 증명
            await reauthenticateWithCredential(user, credential);
            console.log("Success to reauthenticate");

            // 삭제
            await deleteUser(user);
            console.log("Success to Secession");
        } catch (error) {
            console.log(error);
        } finally {
            setPassword("");
            setShowPasswordModal(false);
        }
      }

    return (
        <>
            <Wrapper>
                <InfoBox>
                    <Title>마이페이지</Title>
                    <ProfileArea>
                        <ProfileAreaLeft>
                            <ProfileImage src={user.profile_image_url || "/defaultImage/profile.png"}/>
                            <EditProfileButton >프로필 사진 변경하기</EditProfileButton>
                            <UserName>{user.user_name}</UserName>
                            <Department>{user.user_department}/{user.user_onoffline}</Department>
                            <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                        </ProfileAreaLeft>
                        <ProfileAreaRight>
                            <UserStats user={user}/>
                        </ProfileAreaRight>
                    </ProfileArea>
                </InfoBox>
                <InterestList/>
                <UploadList/>
                <Secession onClick={handleSecessionAlert}>회원탈퇴</Secession>
            </Wrapper>
            <NavigationUser />

            {showSecessionModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>정말로 회원탈퇴를 진행하시겠습니까?</ModalTitle>
                        <ButtonGroup>
                            <ConfirmButton onClick={handleSecessionClick}>확인</ConfirmButton>
                            <CancelButton onClick={handleSecessionCancel}>취소</CancelButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}

            {showPasswordModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalTitle>비밀번호를 입력해주세요</ModalTitle>
                        <Input type= "password"
                                value={password}
                                onChange= {handlePasswordChange}/>
                        <ButtonGroup>
                            <ConfirmButton onClick={handlePasswordSubmit}>확인</ConfirmButton>
                            <CancelButton onClick={() => {setShowPasswordModal(false)}}>취소</CancelButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </>
    );
}

export default UserMain;

// styled components

const Wrapper = styled.div`
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    margin-bottom: 90px;
`;

const InfoBox = styled.div`
    width: 100%;
    border-bottom: 4px solid #F4F4F4;
    padding: 0px 0px 20px 10px;
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

const ProfileImage = styled.img`
    width: 67px;
    height: 67px;
    border-radius: 67px;
    object-fit: cover;
    object-position: center;
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
    cursor: pointer;
`;

const ProfileAreaRight = styled.div`
    width: 100%;
`;

const Secession = styled.div`
    font-size: 11px;
    color: #ff7474;
    margin-bottom: 12px;

    &:hover{
        cursor: pointer;
    }
`;

// Modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 350px;
  width: 100%;
`;

const ModalTitle = styled.div`
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ConfirmButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
`;

const CancelButton = styled.button`
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
`;

const Input = styled.input`
    outline: none;
    border: none;
    border-bottom: 1px solid black;
    margin-bottom: 10px;
    height: 30px;
    width: 200px;
    text-align: center;
`;
