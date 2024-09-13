import styled from "styled-components";
import toggleOn from "/assets/Icon/toggleOn.svg";
import toggleOff from "/assets/Icon/toggleOff.svg";

const Toggle = ({toggleState, setToggleState}) => {
    

    const handleToggleClick = () => {
        setToggleState(toggleState ? false : true);
    }

    return (
        <>
            <Wrapper >
                <ToggleIcon src={toggleState ? toggleOn : toggleOff} alt="Toggle Icon"
                            onClick={handleToggleClick}/>
                <Text onClick={handleToggleClick}>마감된 게시글 보이기</Text>
            </Wrapper>
        </>
    );
}

export default Toggle;

// styled components

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 20px;
    width: 360px;
`;

const ToggleIcon = styled.img`
    width: 14px;
    height: 14px;
`;

const Text = styled.div`
    font-family: "Pretendard-Medium";
    font-size: 11px;
    margin-left: 6px;

    &:hover{
        cursor: pointer;
    }
`;