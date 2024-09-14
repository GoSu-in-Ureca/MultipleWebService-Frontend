import styled from "styled-components";
import PostItem from "./PostItem";
import { selectedSortState } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const PostList = ({toggleState}) => {
    const [sort, setSort] = useRecoilState(selectedSortState);
    // 파이어 베이스에서 불러온 데이터
    const [firePosts, setFirePosts] = useState([]);
    const [sortedData, setSortedData] = useState(firePosts);

    const fetchPosts = async () => {
        try{
            const postsCollection = collection(db, "posts");
            const querySnapshot = await getDocs(postsCollection);

            const resultposts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setFirePosts(resultposts);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    // 배열 정렬 메서드
    const timeOrder = (targetArr) => {
        return targetArr.sort((a, b) =>
            new Date(a.deadline) - new Date(b.deadline)
        );
    }
    const participantOrder = (targetArr) => {
        return targetArr.sort((a, b) => {
            let subA = a.maxParticipants - a.currentParticipants;
            let subB = b.maxParticipants - b.currentParticipants;
            return subA - subB;
        })
    }

    useEffect(() => {
        let posts = firePosts;

        posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const activePosts = posts.filter((post) => new Date(post.deadline) >= new Date());

        if(toggleState){
            if(sort === '시간임박순'){
                const resultPosts = timeOrder(posts);
                setSortedData(resultPosts);
            } else if(sort === '인원임박순'){
                const resultPosts = participantOrder(posts);
                setSortedData(resultPosts);
            } else{
                setSortedData(posts);
            }
        } else {
            if(sort === '시간임박순'){
                const resultPosts = timeOrder(activePosts);
                setSortedData(resultPosts);
            } else if(sort === '인원임박순'){
                const resultPosts = participantOrder(activePosts);
                setSortedData(resultPosts);
            } else {
                setSortedData(activePosts);
            }
        }
    }, [sort, toggleState]);

    return (
        <>
            <Wrapper>
                {firePosts.map((PostData, index) => (
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
