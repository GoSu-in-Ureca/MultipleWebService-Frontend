import styled from "styled-components";
import HotPostItem from "./HotPostItem";
import { useEffect, useState } from "react";
import { selectedCategoryState } from "../../recoil/atoms";
import { useRecoilState } from "recoil";
import HotPostListSkeleton from './HotPostListSkeleton';

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const HotPostList = () => {
    // 파이어 베이스에서 데이터 불러와서 배열로 저장
    const [firePosts, setFirePosts] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [selectedCategory, setSelectedCatogory] = useRecoilState(selectedCategoryState);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태

    // db에서 불러오기
    const fetchPosts = async () => {
        try{
            setIsLoading(true);
            const postsCollection = collection(db, "posts");
            let postsQuery;

            if (selectedCategory === "전체") {
                postsQuery = postsCollection;
            } else {
                postsQuery = query(postsCollection, where("post_category", "==", selectedCategory));
            }
            const querySnapshot = await getDocs(postsQuery);

            const resultposts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            .filter(post => new Date(post.post_deadline) > new Date());

            setFirePosts(resultposts);
        } catch (error) {
            console.log(error);
        } finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const topPosts = [...firePosts]
                        .sort((a, b) => {
                            const aValue = a.post_interest;
                            const bValue = b.post_interest;
                            return bValue - aValue;
                        })
                        .slice(0, 10);

        setSortedData(topPosts);
    },[firePosts]);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory]);

    if (isLoading) {
        // 로딩 중일 때는 스켈레톤 컴포넌트 렌더링
        return <HotPostListSkeleton />;
    }

    return (
        <>
            <Wrapper>
                {sortedData.map((post, index) => (
                    <HotPostItem key={index} post={post} />
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
