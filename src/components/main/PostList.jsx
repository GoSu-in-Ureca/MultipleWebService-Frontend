import styled from "styled-components";
import PostItem from "./PostItem";
import data from "../../postData.json";
import { selectedSortState } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";

const PostList = () => {
    const [sort, setSort] = useRecoilState(selectedSortState);
    const [sortedData, setSortedData] = useState(data);

    useEffect(() => {
        let posts = [...data];

        posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        let activePosts = posts.filter((post) => new Date(post.deadline) >= new Date());
        let expiredPosts = posts.filter((post) => new Date(post.deadline) < new Date());

        if (sort === "최신순") {
        } else if (sort === "시간임박순") {
            activePosts.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else if (sort === "인원임박순") {
            activePosts.sort((a, b) => {
                let subA = a.maxParticipants - a.currentParticipants;
                let subB = b.maxParticipants - b.currentParticipants;
                return subA - subB;
            });
        }

        const combinedPosts = [...activePosts, ...expiredPosts];
        setSortedData(combinedPosts);
    }, [sort]);

    return (
        <>
            <Wrapper>
                {sortedData.map((PostData, index) => (
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
