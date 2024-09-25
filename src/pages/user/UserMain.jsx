import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import UserStats from "../../components/user/UserStats";
import InterestList from "../../components/user/InterestList";
import UploadList from "../../components/user/UploadList";
import UserSkeleton from '../../components/main/UserSkeleton';
import NavigationUser from "../../components/main/NavigationUser";
import { useNavigate, useParams } from 'react-router-dom';


import { auth, db, storage } from "../../firebase";
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut, getAuth, updateProfile, GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { getDownloadURL, ref as strRef, uploadBytes } from "firebase/storage";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

const UserMain = () => {
    const navigate = useNavigate();
    const {userDocId} = useParams();
    const [user ,setUser] = useState(null);
    const [showSecessionModal, setShowSecessionModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const [currentUserDocId, setCurrentUserDocId] = useState(null);
    const inputOpenImageRef = useRef(null);
    const [isGoogleLinked, setIsGoogleLinked] = useState(false);

    // 로그인한 사용자의 Firestore 문서 ID 가져오기
    useEffect(() => {
        const fetchCurrentUserDocId = async () => {
            const currentUser = auth.currentUser; // 현재 로그인한 사용자

            if (currentUser) {
                try {
                    const q = query(collection(db, "users"), where("user_id", "==", currentUser.uid));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        setCurrentUserDocId(querySnapshot.docs[0].id); // 로그인한 사용자의 문서 ID 설정
                    }

                    // 구글 계정 연동 여부 확인
                    const googleLinked = currentUser.providerData.some(
                        (provider) => provider.providerId === "google.com"
                    );
                    setIsGoogleLinked(googleLinked);
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            }
        };
        fetchCurrentUserDocId();
    }, []);

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
    if (!user || currentUserDocId === null) {
        return <UserSkeleton />;
      }

    const handleLogout = async () => {
        try {
          await signOut(auth);
          navigate("/intro");
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

      // 프로필 사진 변경하기
      const handleOpenImageRef = () => {
        inputOpenImageRef.current.click(); // 클릭을 억지로 하도록 함
      };
    
      // 프로필 이미지 업데이트
      const handleProfileUpdate = async (event) => { 
        const file = event.target.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB 제한
        const allowedExtensions = ["jpg", "jpeg", "png"];

        if(file && file.size > maxSize){
            alert("파일 크기는 2MB를 초과할 수 없습니다.");
            return;
        }

        const fileExtension = file.name.split('.').pop().toLowerCase();
        if(!allowedExtensions.includes(fileExtension)){
            alert("유효한 파일 형식이 아닙니다.");
            return;
        }

        try{
            const user = auth.currentUser; // 현재 유저에 대한 정보 

            if(user){
                // 프로필 이미지 Firebase Storage에 업로드
                const imageRef = strRef(storage, `profileImages/${user.uid}`);
                await uploadBytes(imageRef, file);
                const profileImageUrl = await getDownloadURL(imageRef);

                // Firestore 업데이트
                await updateDoc(doc(db, "users", currentUserDocId), {
                    profile_image_url: profileImageUrl,
                });

                await updateProfile(user, {
                    photoURL: profileImageUrl,
                });

                setUser((prevUser)=>({
                    ...prevUser,
                    profile_image_url: profileImageUrl,
                }));

            }
        }catch(error){
            console.log("프로필 업데이트 중 오류 발생: ", error);
        }
      };
      
      const handleGoogleLinkClick = async () => {
        const currentUser = auth.currentUser;

        if(!currentUser) return ;

        try{
            const provider = new GoogleAuthProvider();
            await linkWithPopup(currentUser, provider);

            console.log("success");
        } catch(error) {
            console.log(error);
        }
      }

    return (
        <>
            <Wrapper>
                <InfoBox>
                    <Title>{currentUserDocId === userDocId ? "마이페이지" : `${user.user_name}님의 페이지`}</Title>
                    <ProfileArea>
                        <ProfileAreaLeft>
                            <ProfileImage src={user.profile_image_url || "/defaultImage/profile.png"}/>
                            {currentUserDocId === userDocId && (
                                <EditProfileButton onClick={handleOpenImageRef}>프로필 사진 변경하기</EditProfileButton>
                            )}
                            <UserName>{user.user_name}</UserName>
                            <Department>{user.user_department}/{user.user_onoffline}</Department>
                            {currentUserDocId === userDocId && (
                                <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                            )}
                            <input 
                                onChange={handleProfileUpdate}
                                type="file" 
                                ref={inputOpenImageRef}
                                style={{display: 'none'}}
                                accept='image/jpeg, image/png' // 파일 종류 제한
                            />
                        </ProfileAreaLeft>
                        <ProfileAreaRight>
                            <UserStats user={user}/>
                        </ProfileAreaRight>
                    </ProfileArea>
                </InfoBox>
                <InterestList/>
                <UploadList/>
                <Footer>
                    {!isGoogleLinked && (
                        <GoogleLinkButton onClick={handleGoogleLinkClick}>구글 계정 연동</GoogleLinkButton>
                    )}
                    {currentUserDocId === userDocId && (
                        <Secession onClick={handleSecessionAlert}>회원탈퇴</Secession>
                    )}
                </Footer>
            </Wrapper>
            <NavigationUser />

            {/* 회원 탈퇴 코드 */}
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
    margin-bottom: 65px;
    min-height: calc(100vh - 65px);
`;

const InfoBox = styled.div`
    width: 100%;
    border-bottom: 4px solid #F4F4F4;
    padding: 0px 0px 27px 10px;
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: 700;
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
    cursor: pointer;
    font-size: 10px;
    font-weight: 400;
    color: #404041;
    margin-top: 12px;
`;

const UserName = styled.div`
    font-size: 20px;
    font-weight: 600;
    margin-top: 15px;
`;

const Department = styled.div`
    font-size: 10px;
    font-weight: 400;
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
    font-weight: 400;
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
    font-size: 12px;
    color: #ff7474;
    font-weight: 400;
    
    width: 180px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: 0px 1px 4px rgba(116, 116, 116, 0.2);
    border-radius: 39px;
    margin-top: 13px;
    margin-bottom: 20px;

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

const GoogleLinkButton = styled.div`
    width: 180px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: 0px 1px 4px rgba(116, 116, 116, 0.2);
    border-radius: 39px;
    margin-top: 13px;
    font-size: 12px;
    font-weight: 400;
    color: #404041;

    &:hover{
        cursor: pointer;
    }
`;

const Footer = styled.div`
    width: 390px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 4px solid #F4F4F4;
    padding-top: 10px;
`;