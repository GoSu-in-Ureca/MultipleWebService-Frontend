import {Outlet} from "react-router-dom";
import styled from "styled-components";

const MainLayout = () => {
    return (
        <MainBackGround>
            <Outlet />
        </MainBackGround>
    );
}

export default MainLayout;

// styled components

const MainBackGround = styled.div`
    width: calc(100vw - 10px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;