import styled from "styled-components";
import logo from "/assets/branding/logo.svg";
import { useNavigate } from "react-router-dom";

const IntroForm = () => {
    const navigate = useNavigate();

    const handleLoginNavigate = () => {
        navigate('/login');
    }

    const handleSignUpNavigate = () => {
        navigate('/signup');
    }

    return (
        <>
            <Wrapper>
                <Logo />
                <SubTitle>파티원 모집 플랫폼 서비스</SubTitle>
                <KakaoSignUpButton>
                    카카오로 시작하기
                </KakaoSignUpButton>
                <GoogleSignUpButton>
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
    font-weight: bold;

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
    font-weight: bold;

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
    font-weight: bold;
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
`;

const LoginLink = styled.p`
    font-weight: bold;

    &:hover{
        cursor: pointer;
    }
`;
