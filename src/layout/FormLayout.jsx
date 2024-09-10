import {Outlet} from "react-router-dom";
import styled from "styled-components";

const FormLayout = () => {
    return (
        <ChatBackGround>
            <Outlet />
        </ChatBackGround>
    );
}

export default FormLayout;

// styled components

const ChatBackGround = styled.div`
    width: calc(100vw - 10px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
