import styled from "styled-components";
import PostItem from "./PostItem";
import { selectedSortState } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import { useState, useEffect } from "react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const PostList = ({toggleState}) => {
    const [sort, setSort] = useRecoilState(selectedSortState);
    // 파이어 베이스에서 불러온 데이터를 배열로 상태 관리
    const [firePosts, setFirePosts] = useState([]);
    const [sortedData, setSortedData] = useState(firePosts);

    // db에서 불러오기
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

    // 배열 정렬 메서드 => 시각과 참가자
    const timeOrder = (targetArr) => {
        return targetArr.sort((a, b) =>
            new Date(a.post_deadline) - new Date(b.post_deadline)
        );
    }
    const participantOrder = (targetArr) => {
        return targetArr.sort((a, b) => {
            let subA = a.post_maxparti - a.post_currentparti;
            let subB = b.post_maxparti - b.post_currentparti;
            return subA - subB;
        })
    }

    // 필터 옵션 상태가 바뀔때마다 렌더링
    useEffect(() => {
        let posts = firePosts;

        posts.sort((a, b) => new Date(b.post_createdAt) - new Date(a.post_createdAt));

        const activePosts = posts.filter((post) => new Date(post.post_deadline) >= new Date());

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
    }, [sort, toggleState, firePosts]);

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
