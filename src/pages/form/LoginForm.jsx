import React, { useState } from "react";
import styled from "styled-components";
import logo from "/assets/branding/logo.svg";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const LoginForm = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        try{
            await signInWithEmailAndPassword(auth, email, password);
            setLoginError("");
            navigate("/main");
        } catch (error) {
            setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    return (
        <>
            <Wrapper>
                <Logo />
                <SubTitle>파티원 모집 플랫폼 서비스</SubTitle>
                <Form onSubmit={handleLogin}>
                    <InputEmail>
                        <GuideText>이메일</GuideText>
                        <EmailField onChange={(e) => setEmail(e.target.value)}/>
                    </InputEmail>
                    <InputPassword>
                        <GuideText>비밀번호</GuideText>
                        <PasswordField onChange={(e) => setPassword(e.target.value)}/>
                    </InputPassword>
                    <LoginButton>로그인</LoginButton>
                    <ResultMessage>{loginError}</ResultMessage>
                </Form>
            </Wrapper>
        </>
    );
}

export default LoginForm;

// styled components

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
    margin-bottom: 56px;
`;

const Form = styled.form`

`;

const GuideText = styled.div`
    font-size: 14px;
    color: #BCBEC0;
    text-align: left;
    margin-bottom: 8px;
`;

const InputEmail = styled.div`
    
`;

const EmailField = styled.input.attrs({
    type: "text",
    name: "Id"
})`
    width: 330px;
    height: 40px;
    border: none;
    border-bottom: 1px #BCBEC0 solid;
    outline: none;
    margin-bottom: 21px;

    &:focus {
        border-bottom: 1px solid #7F52FF;
    }
`;

const InputPassword = styled.div`
    
`;

const PasswordField = styled.input.attrs({
    type: "password",
    name: "Password"
})`
    width: 330px;
    height: 40px;
    border: none;
    border-bottom: 1px #BCBEC0 solid;
    outline: none;
    margin-bottom: 21px;

    &:focus {
        border-bottom: 1px solid #7F52FF;
    }
`;

const LoginButton = styled.button.attrs({
    type: "submit"
})`
    width: 345px;
    height: 42px;
    border-radius: 8px;
    border: hidden;
    background-color: #7F52FF;
    color: white;
    font-size: 14px;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover{
        cursor: pointer;
    }
`;

const ResultMessage = styled.div`
    font-size: 12px;
    color: #FF3838;
    margin-top: 10px;
    width: 100%;
    text-align: center;
`;
