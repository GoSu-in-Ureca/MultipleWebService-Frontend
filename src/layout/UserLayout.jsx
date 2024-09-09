import {Outlet} from "react-router-dom";
import styled from "styled-components";

const UserLayout = () => {
    return (
        <UserBackGround>
            <Outlet />
        </UserBackGround>
    );
}

export default UserLayout;

// styled components

const UserBackGround = styled.div`
    width: calc(100vw - 10px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`;
