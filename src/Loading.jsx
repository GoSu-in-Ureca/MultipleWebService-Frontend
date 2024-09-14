import styled, {keyframes} from "styled-components";
import logo from "/assets/branding/logo.svg";

const Loading = () => {
    return (
        <>
            <Wrapper>
                <BackGround>
                    <Logo />
                </BackGround>
            </Wrapper>
        </>
    );
}

export default Loading;

// keyframes def

const rotateAnimation = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

// styled components

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
`;

const BackGround = styled.div`
    width: 390px;
    display: flex;
    justify-content: center;
    background-color: white;
`;

const Logo = styled.img.attrs({
    src: logo,
    alt: "Logo Image"
})`
    width: 200px;
    animation: ${rotateAnimation} 2.5s infinite  ease-out;
    transform-style: preserve-3d;
`;
