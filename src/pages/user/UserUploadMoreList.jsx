import React from "react";
import styled from "styled-components";
import backbutton from "/assets/Icon/navigate_before.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UploadMoreItem from "../../components/user/UploadMoreItem";
import NavigationUser from "../../components/main/NavigationUser";
import UserUploadSkeleton from '../../components/user/UserUploadSkeleton';

import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs, where, query } from "firebase/firestore";

const UserUploadList = () => {
    const {userDocId} = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [fireposts, setFireposts] = useState([]);
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
                where('post_user_name', '==', user.user_name)
            );
            const postSnapshot = await getDocs(queryCollection);
            const postsArray = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            postsArray.sort((a, b) => new Date(b.post_createdAt) - new Date(a.post_createdAt));

            setFireposts(postsArray);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingPosts(false);
        }
    };

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
        return <UserUploadSkeleton />;
    }

    const handleIntroNavigate = () => {
        navigate(-1);
    }

    return (
        <>
            <Wrapper>
                <Header>
                    <BackButton onClick={handleIntroNavigate}/>
                    <Title>{user.user_name}님이 작성한 게시글</Title>
                </Header>
                <MainArea>
                    {fireposts.map((post) => (
                        <UploadMoreItem post={post} key={post.id} />
                        
                    ))}
                </MainArea>
            </Wrapper>
            <NavigationUser />
        </>
    );
}

export default UserUploadList;

// style components

const Wrapper = styled.div`
    font-family: "Pretendard-Medium";
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    margin-bottom: 90px;
    min-height: calc(100vh - 90px);
`;

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

    &:hover{
        cursor: pointer;
    }
`;

const MainArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-left: 68px;
`;
