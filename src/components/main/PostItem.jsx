import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { db } from "../../firebase";
import { collection, doc, getDocs, query, runTransaction, where } from "firebase/firestore";

const PostItem = ({post}) => {
    const navigate = useNavigate();
    const deadLineDate = new Date(post.post_deadline);
    const [author, setAuthor] = useState(null);
    const [profileImageurl, setProfileImageurl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    
    // 마감일 계산
    const calculateLeftDays = () => {
        const now = new Date();
        const difference = (deadLineDate - now) / (1000*60*60*24);
        
        return difference >= 0 ? Math.floor(difference) : "마감";
    }
    const [leftDays, setLeftDays] = useState(calculateLeftDays);
    useEffect(() => {
        setLeftDays(calculateLeftDays());
    }, [Date.now()]);

    // 작성자 정보 불러오기
    const fetchAuthorData = async () => {
        try {
            const usersCollection = collection(db, "users");
            const userQuery = query(usersCollection, where("user_id", "==", post.post_user_id));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const authorDocSnapshot = querySnapshot.docs[0];
                const authorData = authorDocSnapshot.data();
                setAuthor({ ...authorData, id: authorDocSnapshot.id });
                
                // 프로필 이미지 설정
                setProfileImageurl(authorData.profile_image_url || "/assets/BG/defaultProfile.png");
                console.log(profileImageurl);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 게시글 대표 사진 불러오기
    const fetchPostThumbnail = () => {
        const thumbnail = post.post_images && post.post_images.length > 0 ? post.post_images[0] : "/assets/BG/defaultImage.png";
        setThumbnailUrl(thumbnail);
    };

    useEffect(() => {
        fetchAuthorData();
        fetchPostThumbnail();
    }, [post.post_user_id, post]);

    const incrementViewCount = async (postId) => {
        try{
            const postDocRef = doc(db, "posts", postId);
            await runTransaction(db, async (transaction) => {
                const postDoc = await transaction.get(postDocRef);

                if(!postDoc.exists){
                    return;
                }

                const newViewCount = (postDoc.data().post_view || 0) + 1;
                transaction.update(postDocRef, { post_view: newViewCount});
            });
        } catch (error) {
            console.log(error);
        }
    }

    // 게시글 클릭 시 라우팅
    const handlePostClick = () => {
        // view 1 증가
        incrementViewCount(post.id);
        navigate(`/main/${post.id}`);
      };

      // 작성 시간 계산 메서드
    const getTimeDifference = (createdAt) => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const diff = (now - postDate) / 1000;

        if(diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if(diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        return `${Math.floor(diff / 86400)}일 전`;
    };

    const handleProfileClick = (e) => {
        e.stopPropagation();
        if(author)
        navigate(`/user/main/${author.id}`);
    }

    return (
        <>
            <Wrapper onClick={handlePostClick}>
                <Image src={thumbnailUrl} alt="Post Prensent Image"/>
                <TextArea>
                    <Top>
                        <InfoWrapper>
                            <DayItem $isexpired={leftDays === '마감'}>{leftDays === "마감" ? "마감" : `D-${leftDays}`}</DayItem>
                            <CategoryItem>{post.post_category}</CategoryItem>
                            <PartyStatus><span style={{color: "#7F52FF"}}>{post.post_currentparti}</span> / {post.post_maxparti}</PartyStatus>
                        </InfoWrapper>
                        <TimeIndicator>{getTimeDifference(post.post_createdAt)}</TimeIndicator>
                    </Top>
                    <Middle>{post.post_title}</Middle>
                    <Bottom>
                        <Profile src={profileImageurl} onClick={handleProfileClick}></Profile>
                        <Author onClick={handleProfileClick}>{post.post_user_name}</Author>
                    </Bottom>
                </TextArea>
            </Wrapper>
        </>
    );
}

export default PostItem;

// styled components

const Wrapper = styled.div`
    display: flex;
    padding: 15px 18px;
    border-bottom: 1px solid #F5F5F5;
    
    &:hover{
        background-color: #f7f7f7;
        cursor: pointer;
    }
`;

const Image = styled.img`
    width: 96px;
    height: 96px;
    border-radius: 11px;
    background-color: lightgray;
    object-fit: cover;
    object-position: center;
`;

const TextArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-left: 18px;
`;

const Top = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 7px;
    height: 17px;
    white-space: nowrap;
`;

const InfoWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const DayItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 8px;
    font-weight: bold;
    color: white;
    padding: 0 9.5px 0 9.5px;
    border: 1px solid ${(props) => (props.$isexpired ? "#808080" : "#7f52ff")};
    border-radius: 19.5px;
    background-color: ${(props) => (props.$isexpired ? "#808080" : "#7f52ff")};
`;

const CategoryItem = styled.div`
    height: 100%;
    margin-left: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8px;
    font-weight: bold;
    color: #404040;
    padding: 0 9.5px 0 9.5px;
    border: 1px solid #808264;
    border-radius: 19.5px;
`;

const PartyStatus = styled.div`
    font-size: 11px;
    margin-left: 8px;
`;

const TimeIndicator = styled.div`
    color: #BCBEC0;
    font-size: 11px;
`;

const Middle = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
    width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Bottom = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 14px;
`;

const Profile = styled.img`
    width: 20px;
    height: 20px;
    object-fit: cover;
    object-position: center;
    border-radius: 20px;
    background-color: gray;
    justify-content: flex-start;
`;

const Author = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 7px;
    font-size: 12px;
    color: #404040;
`;
