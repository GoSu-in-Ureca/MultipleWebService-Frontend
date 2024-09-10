import styled from "styled-components";
import HotPostItem from "./HotPostItem";
import data from "../../hotPostData.json";

const HotPostList = () => {
    return (
        <>
            <Wrapper>
                {data.map((HotPostData, index) => (
                    <HotPostItem key={index} HotPost={HotPostData} />
                ))}
            </Wrapper>
        </>
    );
}

export default HotPostList;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    width: 372px;
    height: 185px;
    margin: 15px 0 0 18px;

    &::-webkit-scrollbar{
        display: none;
    }
`;
