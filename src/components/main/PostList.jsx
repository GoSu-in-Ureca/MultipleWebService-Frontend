import styled from "styled-components";
import PostItem from "./PostItem";
import data from "../../postData.json";

const PostList = () => {
    return (
        <>
            <Wrapper>
                {data.map((PostData, index) => (
                    <PostItem key={index} post={PostData}/>
                ))}
            </Wrapper>
        </>
    );
}

export default PostList;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 90px;
`;
