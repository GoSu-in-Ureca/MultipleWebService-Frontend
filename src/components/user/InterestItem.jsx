import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heart from "/assets/Icon/heart-fill.svg";

import { db } from "../../firebase";
import { doc, runTransaction } from "firebase/firestore";

const InterestItem = ({post, user}) => {
    const navigate = useNavigate();
    const deadLineDate = new Date(post.post_deadline);

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
    };

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

     // 게시글 클릭 시 라우팅
     const handlePostClick = () => {
        // view 1 증가
        incrementViewCount(post.id);
        navigate(`/main/${post.id}`);
      };

    return (
        <>
            <Wrapper onClick={handlePostClick}>
                <ThumbnailArea $thumbnailurl={post.post_images[0] || "/assets/BG/defaultImage.png"}>
                    <Dday>D-{leftDays}</Dday>
                    <InterestArea>
                        <HeartIcon src={heart}/>
                        <InterestCount>{post.post_interest}</InterestCount>
                    </InterestArea>
                </ThumbnailArea>
                <Title>{post.post_title}</Title>
                <AuthorArea>
                    <ProfileImage src={user.profile_image_url || "/defaultImage/profile.png"}/>
                    <AuthorName>{user.user_name}</AuthorName>
                </AuthorArea>
            </Wrapper>
        </>
    );
}

export default InterestItem;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 120px;
    height: 163px;

    &:hover{
        cursor: pointer;
    }
`;

const ThumbnailArea = styled.div`
    background-image: url(${props => props.$thumbnailurl});
    background-size: cover;
    background-position: center;
    height: 120px;
    width: 120px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
`;

const Dday = styled.div`
    width: 30px;
    height: 15px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 0.3px solid #ffffff;
    border-radius: 20px;
    font-family: 'Pretendard-Regular';
    font-size: 8px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 9px;
    margin-top: 8px;
`;

const InterestArea = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 9px;
    margin-bottom: 8px;
`;

const HeartIcon = styled.img.attrs({
    alt: "heart icon"
})`
    width: 9px;
`;

const InterestCount = styled.div`
    font-size: 9px;
    color: white;
    margin-left: 3px;
`;

const Title = styled.div`
    font-weight: 800;
    font-size: 12px;
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 8px 0px 6px 0px;
`;

const AuthorArea = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const ProfileImage = styled.img.attrs({
    alt: "Author Profile",
})`
    width: 15px;
    height: 15px;
    border-radius: 15px;
`;

const AuthorName = styled.div`
    font-family: 'Pretendard-Regular';
    font-size: 11px;
    margin-left: 4px;
`;
