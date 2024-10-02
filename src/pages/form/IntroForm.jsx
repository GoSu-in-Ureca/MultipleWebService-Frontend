import styled from "styled-components";
import logo from "/assets/branding/logo.svg";
import { useNavigate } from "react-router-dom";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

const IntroForm = () => {
    const navigate = useNavigate();

    const handleLoginNavigate = () => {
        navigate('/login');
    }

    // Kakao Login handler
    const handleKakaoLogin = () => {
        Kakao.Auth.login({
            success: async function (authObj) {
                try {
                    // Firebase Functions로 액세스 토큰 전달
                    const response = await fetch('https://us-central1-multiplewebservice-bdff9.cloudfunctions.net/createCustomToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: authObj.access_token }),
                    });
    
                    const data = await response.json(); 
                    const firebaseToken = data.token;
    
                    // Firebase Custom Token으로 로그인
                    await auth.signInWithCustomToken(firebaseToken);
    
                    navigate('/main'); // 로그인 후 메인 페이지로 이동
                } catch (error) {
                    console.error('Firebase Custom Token 오류:', error);
                }
            },
            fail: function (error) {
                console.log('카카오 로그인 실패:', error);
            },
        });
    };
    

    const handleSignUpNavigate = () => {
        navigate('/signup');
    }

    const handleGoogleNavigate = async () => {
        const provider = new GoogleAuthProvider();

        try {
            // 구글 로그인 시도
            const result = await signInWithPopup(auth, provider);
            navigate("/auth-google"); // 로그인 성공 후 신규 유저인지 체크하고 리다이렉트
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Wrapper>
                <Logo />
                <SubTitle>파티원 모집 플랫폼 서비스</SubTitle>
                <KakaoSignUpButton onClick={handleKakaoLogin}>
                    카카오로 시작하기
                </KakaoSignUpButton>
                <GoogleSignUpButton onClick={handleGoogleNavigate}>
                    구글로 시작하기
                </GoogleSignUpButton>
                <EmailSignUpButton onClick={handleSignUpNavigate}>
                    이메일로 시작하기
                </EmailSignUpButton>
                <LoginGuideArea>
                    <p>이미 가입하셨나요?</p>
                    <LoginLink onClick={handleLoginNavigate}>로그인하기</LoginLink>
                </LoginGuideArea>
            </Wrapper>
        </>
    );
}

export default IntroForm;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 390px;
    height: 100vh;
    min-height: 844px;
    background-color: white;
`;

const Logo = styled.img.attrs({
    src: logo,
    alt: "Logo Image"
})`
    width: 165px;
    margin-top: 221px;
`

const SubTitle = styled.div`
    font-size: 12px;
    color: #808284;
    margin-top: 13px;
`;

const KakaoSignUpButton = styled.div`
    width: 289px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FEE500;
    border: 1px #FEE500 solid;
    border-radius: 39px;
    margin-top: 93px;
    font-size: 14px;
    font-weight: 500;

    &:hover{
        cursor: pointer;
    }
`;

const GoogleSignUpButton = styled.div`
    width: 289px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: #BCBEC0 1px solid;
    border-radius: 39px;
    margin-top: 13px;
    font-size: 14px;
    font-weight: 500;

    &:hover{
        cursor: pointer;
    }
`;

const EmailSignUpButton = styled.div`
    width: 289px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    border: black 1px solid;
    border-radius: 39px;
    margin-top: 13px;
    font-size: 14px;
    font-weight: 500;
    color: white;

    &:hover{
        cursor: pointer;
    }
`;

const LoginGuideArea = styled.div`
    display: flex;
    font-size: 10px;
    gap: 16px;
    margin-top: 8px;
    font-weight: 400;
`;

const LoginLink = styled.p`
    font-weight: 600;

    &:hover{
        cursor: pointer;
    }
`;
