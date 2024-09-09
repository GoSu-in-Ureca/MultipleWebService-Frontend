import React, { useState } from "react";
import styled from "styled-components";
import backbutton from "/assets/Icon/navigate_before.svg";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
    const navigate = useNavigate();
    const [profileImage, setProfileImage] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [selectDepartment, setSelectDepartment] = useState("프론트엔드");
    const [selectOnOff, setSelectOnOff] = useState("대면");
    const [fileSizeAlert, setFileSizeAlert] = useState("");
    const [emailFormatAlert, setEmailFormatAlert] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rePasswordError, setRePasswordError] = useState("");

    const handleIntroNavigate = () => {
        navigate('/intro');
    }
    const handleMainNavigate = () => {
        navigate('/main');
    }
    const handleDepartmentClick = (department) => {
        setSelectDepartment(department)
    }
    const handleOnOffClick = (onoff) => {
        setSelectOnOff(onoff);
    }

    // 프로필 이미지 변경마다 업데이트
    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB
    
        if (file && file.size > maxSize) {
            setFileSizeAlert("파일 용량은 2MB를 초과할 수 없습니다");
            return;
        }
    
        if (file) {
            setFileSizeAlert("");
            setProfileImage(URL.createObjectURL(file));
        }
    };

    // 이메일 입력마다 업데이트
    const handleEmailChange = (event) => {
        const emailInput = event.target.value;
        setEmail(emailInput);

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailInput)) {
            setEmailFormatAlert("올바른 이메일 형식이 아닙니다.");
        } else {
            setEmailFormatAlert("");
        }
    };

    // 비밀번호 유효성 검사
    const handlePasswordChange = (event) => {
        const passwordInput = event.target.value;
        setPassword(passwordInput);

        const passwordPattern = /^.{8,20}$/;
        if (!passwordPattern.test(passwordInput)) {
            setPasswordError("비밀번호는 8-20자 이내에서 설정 가능합니다");
        } else {
            setPasswordError("");
        }
    };

    // 비밀번호 확인 유효성 검사
    const handleRePasswordChange = (event) => {
        const rePasswordInput = event.target.value;
        setRePassword(rePasswordInput);

        if (rePasswordInput !== password) {
            setRePasswordError("비밀번호가 일치하지 않습니다");
        } else {
            setRePasswordError("비밀번호가 일치합니다");
        }
    };

    return (
        <>
            <Wrapper>
                <Header>
                    <BackButton onClick={handleIntroNavigate}/>
                    <Title>회원가입</Title>
                </Header>
                <ProfileImageArea
                    onClick={() => document.getElementById('fileInput').click()}
                    style={{
                        backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        accept=".png, .jpg, .jpeg"
                        onChange={handleProfileImageChange}
                    />
                </ProfileImageArea>

                <ChangeProfileButton
                        onClick={() => document.getElementById('fileInput').click()}
                    >프로필 사진 변경하기
                </ChangeProfileButton>
                <FileValidation>{fileSizeAlert}</FileValidation>
                <InputGuideText>
                    이메일
                    <EmailValidation>{emailFormatAlert}</EmailValidation>
                </InputGuideText>
                <InputEmail 
                    value={email} 
                    onChange={handleEmailChange} 
                />
                <InputGuideText>이름</InputGuideText>
                <InputName></InputName>
                <InputGuideText>
                    비밀번호
                    {passwordError && <PasswordValidation>{passwordError}</PasswordValidation>}
                </InputGuideText>
                <InputPassword
                    value={password}
                    onChange={handlePasswordChange}
                />
                <InputGuideText>
                    비밀번호 확인
                    {rePasswordError && (
                    <RePasswordValidation isMatch={rePasswordError === "비밀번호가 일치합니다"}>
                        {rePasswordError}
                    </RePasswordValidation>
                )}
                </InputGuideText>
                <InputRePassword
                    value={rePassword}
                    onChange={handleRePasswordChange}
                />
                <InputDepartmentArea>
                    <InputGuideText>소속</InputGuideText>
                    <SubTitle>분야</SubTitle>
                    <SelectArea>
                        <Item
                            isSelected={selectDepartment === '프론트엔드'}
                            onClick={() => handleDepartmentClick('프론트엔드')}
                        >
                            프론트엔드
                        </Item>
                        <Item
                            isSelected={selectDepartment === '백엔드'}
                            onClick={() => handleDepartmentClick('백엔드')}
                        >
                            백엔드
                        </Item>
                    </SelectArea>
                    <SubTitle>대면 여부</SubTitle>
                    <SelectArea>
                        <Item
                            isSelected={selectOnOff === '대면'}
                            onClick={() => handleOnOffClick('대면')}
                        >
                            대면
                        </Item>
                        <Item
                            isSelected={selectOnOff === '비대면'}
                            onClick={() => handleOnOffClick('비대면')}
                        >
                            비대면
                        </Item>
                    </SelectArea>
                </InputDepartmentArea>

                <SignUpButton onClick={handleMainNavigate}>가입하기</SignUpButton>
            </Wrapper>
        </>
    );
}

export default SignUpForm;

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

const Header = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 52px;
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

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-left: 132px;
`;

const ProfileImageArea = styled.div`
    margin-top: 30px;
    width: 67px;
    height: 67px;
    background-color: gray;
    border-radius: 67px;

    &:hover{
        cursor: pointer;
    }
`;

const ChangeProfileButton = styled.div`
    font-size: 11px;
    font-weight: bold;
    margin-top: 14px;

    &:hover{
        cursor: pointer;
    }
`;

const FileValidation = styled.div`
    width: 100%;
    height: 15px;
    font-size: 10px;
    color: #FF3838;
    text-align: center;
    margin-bottom: 32px;
`;

const InputGuideText = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #BCBEC0;
    width: 330px;
    text-align: left;
`;

const InputEmail = styled.input.attrs({
    type: "text",
    name: "email"
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

const EmailValidation = styled.div`
    font-size: 10px;
    color: #FF3838;
    margin-left: 18px;
`;

const InputName = styled.input.attrs({
    type: "text",
    name: "name"
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

const InputPassword = styled.input.attrs({
    type: "password",
    name: "password"
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

const PasswordValidation = styled.div`
    font-size: 10px;
    color: #FF3838;
    margin-left: 18px;
`;

const InputRePassword = styled.input.attrs({
    type: "password",
    name: "repassword"
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

const RePasswordValidation = styled.div`
    font-size: 10px;
    color: ${({ isMatch }) => (isMatch ? '#7F52FF' : '#FF3838')};
    margin-left: 18px;
`;

const SubTitle = styled.div`
    font-size: 12px;
    color: #BCBEC0;
    margin: 12px 0;
`

const InputDepartmentArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 330px;
`;

const SelectArea = styled.div`
    display: flex;
`

const Item = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px 20px;
    margin-right: 10px;
    width: auto;
    font-size: 11px;
    border-radius: 13px;
    background-color: ${({ isSelected }) => (isSelected ? 'black' : '#E2E2E2')};
    color: ${({ isSelected }) => (isSelected ? 'white' : '#808284')};
    cursor: pointer;

    &:hover {
        cursor: pointer;
    }
`;

const SignUpButton = styled.div`
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
    margin-top: 62px;

    &:hover{
        cursor: pointer;
    }
`;
