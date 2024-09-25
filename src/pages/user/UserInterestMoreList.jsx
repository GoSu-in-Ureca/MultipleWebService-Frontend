import React from "react";
import styled from "styled-components";
import backbutton from "/assets/Icon/navigate_before.svg";
import NavigationUser from "../../components/main/NavigationUser";
import InterestMoreItem from "../../components/user/InterestMoreItem";
import SortFilter from "../../components/main/SortFilter";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedSortState } from "../../recoil/atoms";
import UserInterestSkeleton from '../../components/user/UserInterestSkeleton';

import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const UserInterestMoreList = () => {
    const {userDocId} = useParams();
    const navigate = useNavigate();
    const [sort, setSort] = useRecoilState(selectedSortState);
    const [user, setUser] = useState(null);
    const [fireposts, setFireposts] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // 현재 페이지의 사용자 데이터 가져오기
    const fetchUser = async () => {
        try {
            const userDocRef = doc(db, 'users', userDocId);
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
                setUser(userSnapshot.data());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingUser(false);
        }
    };

    // 게시글 전체 불러오기
    const fetchPost = async () => {
        if (!user) return;
        try {
            const queryCollection = query(
                collection(db, 'posts'),
                where('post_liked_users', 'array-contains', user.user_id)
            );
            const postSnapshot = await getDocs(queryCollection);
            const postsArray = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            postsArray.sort((a, b) => new Date(b.post_createdAt) - new Date(a.post_createdAt));

            setFireposts(postsArray);
            setSortedData(postsArray);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingPosts(false);
        }
    };

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

    // 필터 옵션 상태가 바뀔때마다 재정렬
    useEffect(() => {
        let posts = [...fireposts];
         console.log(sort)

        if (posts.length === 0) {
            setSortedData([]);
            return;
        }

        posts.sort((a, b) => new Date(b.post_createdAt) - new Date(a.post_createdAt));

        if (sort === "시간임박순") {
            setSortedData(timeOrder(posts));
        } else if (sort === "인원임박순") {
            setSortedData(participantOrder(posts));
        }
    }, [sort, fireposts, selectedSortState]);

    // 사용자 데이터 로드
    useEffect(() => {
        fetchUser();
    }, [userDocId]);

    // 사용자 데이터 로드가 끝난 후 게시글 데이터 로드
    useEffect(() => {
        if (user) {
            fetchPost();
        }
    }, [user]);

    // 모든 데이터가 로드될 때까지 로딩 화면 표시
    if (loadingUser || loadingPosts) {
        return <UserInterestSkeleton />;
    }

    const handleIntroNavigate = () => {
        navigate(-1);
    }

    return (
        <>
            <Wrapper>
                <Header>
                    <BackButton onClick={handleIntroNavigate}/>
                    <Title>{user.user_name}님이 찜한 게시글</Title>
                </Header>
                <FilterWrapper>
                    <SortFilter sort={sort} setSort={setSort}/>
                </FilterWrapper>
                <InterestList>
                    {sortedData.map((post, index) => (
                        <InterestMoreItem post={post} key={index} />
                    ))}
                </InterestList>
            </Wrapper>
            <NavigationUser />
        </>
    );
}

export default UserInterestMoreList;

// styled components

const Wrapper = styled.div`
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    margin-bottom: 65px;
    min-height: calc(100vh - 65px);
`

const Header = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 52px;
`;


const BackButton = styled.img.attrs({
    src: backbutton,
    alt: "Back Button"
})`
    width: 24px;
    height: 24px;
    margin-left: 10px;
    z-index: 1;

    &:hover{
        cursor: pointer;
    }
`;

const Title = styled.div`
    width: 390px;
    display: flex;
    justify-content: center;
    position: absolute;
    font-size: 16px;
    font-weight: 600;
`;

const FilterWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 3px;
    margin-right: 3px;
`;

const InterestList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    width: 100%;
`;
