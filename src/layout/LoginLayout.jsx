import {Outlet} from "react-router-dom";
import styled from "styled-components";

const LoginLayout = () => {
    return (
        <LoginBackGround>
            <Outlet />
        </LoginBackGround>
    );
}

export default LoginLayout;

// styled components

const LoginBackGround = styled.div`
    width: calc(100vw - 10px);
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
