import React from "react";
import styled from "styled-components";
import logo from "/assets/branding/logo.svg";

const LoginForm = () => {
    return (
        <>
            <Wrapper>
                <Logo />
                <SubTitle>파티원 모집 플랫폼 서비스</SubTitle>
                <InputId>
                    <GuideText>이메일</GuideText>
                    <IdField></IdField>
                </InputId>
                <InputPassword>
                    <GuideText>비밀번호</GuideText>
                    <PasswordField></PasswordField>
                </InputPassword>
                <LoginButton>로그인</LoginButton>
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

const GuideText = styled.div`
    font-size: 14px;
    color: #BCBEC0;
    text-align: left;
    margin-bottom: 22px;
`;

const InputId = styled.div`
    
`;

const IdField = styled.input.attrs({
    type: "text",
    name: "Id"
})`
    width: 330px;
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
    border: none;
    border-bottom: 1px #BCBEC0 solid;
    outline: none;
    margin-bottom: 21px;

    &:focus {
        border-bottom: 1px solid #7F52FF;
    }
`;

const LoginButton = styled.div`
    width: 345px;
    height: 42px;
    border-radius: 8px;
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
