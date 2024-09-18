import styled from "styled-components";
import heart from "/assets/Icon/heart.svg"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../firebase";
import { collection, doc, getDocs, query, runTransaction, where } from "firebase/firestore";

const HotPostItem = ({post}) => {
    const navigate = useNavigate();
    const [profileImageurl, setProfileImageurl] = useState("");
    const [author, setAuthor] = useState(null);
    const [thumbnailurl, setThumbnailurl] = useState("");

    // 마감일 계산
    const calculateLeftDays = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const difference = (deadlineDate - now) / (1000*60*60*24);
        
        return difference >= 0 ? Math.floor(difference) : "마감";
    }
    const [leftDays, setLeftDays] = useState(calculateLeftDays(post.post_deadline));

    useEffect(() => {
        setLeftDays(calculateLeftDays(post.post_deadline));
    }, [post.post_deadline]);

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
        setThumbnailurl(thumbnail);
    };

    useEffect(() => {
        fetchAuthorData();
        fetchPostThumbnail();
    }, [post.post_user_id, post]);

    // 조회수 증가
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
     const handleHotPostClick = () => {
        // view 1 증가
        incrementViewCount(post.id);
        navigate(`/main/${post.id}`);
      };

      // 프로필 사진 클릭 시 라우팅
      const handleProfileClick = (e) => {
        e.stopPropagation();
        if(author)
        navigate(`/user/main/${author.id}`);
    }

    return (
        <>
            <Wrapper $thumbnailurl={thumbnailurl} onClick={handleHotPostClick}>
                <HeadArea>
                    <HeadItem>D-{leftDays}</HeadItem>
                    <HeadItem>{post.post_category}</HeadItem>
                </HeadArea>
                <BottomArea>
                    <Interest>
                        <InterestIcon />
                        <InterestCount>{post.post_interest}</InterestCount>
                    </Interest>
                    <Title>{post.post_title}</Title>
                    <AuthorArea>
                        <AuthorProfile src={profileImageurl ? profileImageurl : "/assets/BG/defaultProfile.png"} onClick={handleProfileClick}/>
                        <AuthorName onClick={handleProfileClick}>{post.post_user_name}</AuthorName>
                    </AuthorArea>
                </BottomArea>
            </Wrapper>
        </>
    );
}

export default HotPostItem;

// styled components

const Wrapper = styled.div`
    position: relative;
    background-image: url(${props => props.$thumbnailurl});
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    min-width: 136px;
    padding: 12px;
    border-radius: 11px;
    background-color: black;
    margin-right: 13px;
    white-space: nowrap;
    overflow: hidden;

    // 오버레이 추가를 위한 before 요소
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4); /* 원하는 투명도 조정 */
        border-radius: 11px;
    }

    &:hover {
        cursor: pointer;
    }
`;


const HeadArea = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    z-index: 1;
`;

const HeadItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px white solid;
    border-radius: 19.5px;
    font-size: 8px;
    color: white;
    background-color: rgba(255, 255, 255, 0.5);
    margin-right: 6px;
    padding: 3.5px 9px;
`;

const BottomArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    z-index: 1;
`;

const Interest = styled.div`
    display: flex;
    justify-content: flex-start;
`

const InterestIcon = styled.img.attrs({
    src: heart,
    alt: "Heart Icon"
})`
    width: 10px;
    height: 10px;
`;

const InterestCount = styled.div`
    font-size: 8px;
    color: white;
    display: flex;
    justify-content: center;
    margin-left: 3px;
`;

const Title = styled.div`
    font-size: 14px;
    color: white;
    max-width: 120px;
    white-space: pre-wrap;
    margin-top: 5px;
`;

const AuthorArea = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
`;

const AuthorProfile = styled.img`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-color: gray;
    object-fit: cover;
    object-position: center;
`;

const AuthorName = styled.div`
    height: 20px;
    font-size: 11px;
    color: white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* align-items: center; */
    margin-left: 7px;
`;
