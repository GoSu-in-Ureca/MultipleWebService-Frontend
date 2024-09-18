import styled from "styled-components";
import InterestItem from "./InterestItem";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const InterestList = () => {
    const navigate = useNavigate();
    const {userDocId} = useParams();
    const [user, setUser] = useState();
    const [firePosts, setFirePosts] = useState([]);
    const [sortedData, setSortedData] = useState([]);

    // 사용자 불러오기
    const fetchUser = async () => {
        
        try{
            const userDocRef = doc(db, 'users', userDocId);
            const userSnapshot = await getDoc(userDocRef);
            if(userSnapshot.exists)
            setUser(userSnapshot.data());
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userDocId]);

    // 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            if(!user) return;
            try {
                const postsCollection = collection(db, "posts");
                const queryCollection = query(postsCollection, where("post_user_name", "==", user.user_name));

                const resultPosts = (await getDocs(queryCollection)).docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setFirePosts(resultPosts);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPost();
    }, [user])

    // 최종 게시글 목록
    useEffect(() => {
        const topPosts = [...firePosts]
                        .sort((a, b) => {
                            const dateA = new Date(a.post_createdAt);
                            const dateB = new Date(b.post_createdAt);
                            return dateB - dateA;
                        })
                        .slice(0, 10);

        setSortedData(topPosts);
    }, [firePosts])

    const handleHeartPostListNavigate = () => {
        navigate(`/user/interest/${userDocId}`);
    };

    return (
        <Wrapper>
            <HeartPost>
                <HeartPostTitle>내가 찜한 게시글</HeartPostTitle>
                <WholeView onClick={handleHeartPostListNavigate}>전체보기</WholeView>
            </HeartPost>
            <HeartPostContent>
                {sortedData.map((post, index) => (
                    <InterestItem key={index} post={post} user={user}/>
                ))}
            </HeartPostContent>
        </Wrapper>
    );
}

export default InterestList;

// styled components

const Wrapper = styled.div`
    max-width: 390px;
    padding: 20px 23px 15px 23px;
    box-sizing: border-box;
`;

const HeartPost = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const HeartPostTitle = styled.div`
    font-family: 'Pretendard-SemiBold';
    font-size: 16px;
`;

const WholeView = styled.div`
    font-family: 'Pretendard-Regular';
    font-size: 12px;
    cursor: pointer;
`;

const HeartPostContent = styled.div`
     display: flex;
    justify-content: flex-start;
    gap: 15px;
    overflow-x: auto;
    scrollbar-width: none;
    width: 100%;
`;
