import styled from "styled-components";
import profile from "/assets/BG/ProfileExample2.jpg";
import dot from "/assets/Icon/dot.svg";
import { useNavigate } from "react-router-dom";
import { increment } from "firebase/firestore";

const UploadMoreItem = ({post}) => {
    const navigate = useNavigate();
    const deadLineDate = new Date(post.post_deadline);
    const leftDays = Math.ceil((deadLineDate-Date.now()) / (1000*60*60*24));
    const createdDate = new Date(post.post_createdAt).toLocaleString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\. /g, '.');

    const handlePostClick = () => {
        incrementViewCount(post.id);
        navigate(`/main/${post.id}`);
    }

    const incrementViewCount = async (postId) => {
        try{
            const postDocRef = doc(db, "posts", postId);
            await updateDoc(postDocRef, {
                post_view: increment(1),
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Wrapper onClick={handlePostClick}>
            <PresentImage src={post.imageUrl || "/assets/BG/defaultImage.png"} alt="Post Image" />
            <MainArea>
                <TitleArea>
                    <Title>{post.post_title}</Title>
                    <CreatedAt>{createdDate}</CreatedAt>
                </TitleArea>
                <Content>{post.post_content}</Content>
                <InfoArea>
                    <LeftDays>{leftDays > 0 ? `D-${leftDays}` : "마감"}</LeftDays>
                    <DotIcon />
                    <PartyStatus>
                        참여 인원 <span style={{ color: "#7F52FF" }}>{post.post_currentparti}</span> / {post.post_maxparti}
                    </PartyStatus>
                </InfoArea>
            </MainArea>
        </Wrapper>
    );
};

export default UploadMoreItem;

// styled components

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 16px 22px;
    border-bottom: 1px solid #F5F5F5;

    &:hover{
        background-color: #F7F7F7;
        cursor: pointer;
    }
`;

const PresentImage = styled.img.attrs({
    src: profile,
    alt: "Profile Image"
})`
    width: 70px;
    height: 70px;
    border-radius: 11px;
    background-color: gray;
    margin-right: 13px;
    align-self: center;
`;

const MainArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 262px;
`;

const TitleArea = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const CreatedAt = styled.div`
    font-size: 8px;
    text-align: right;
    width: 60px;
    color: #888888;
`;

const Content = styled.div`
    font-size: 12px;
    color: #BCBEC0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 230px;
`;

const InfoArea = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 110px;
    height: 15px;
    font-size: 10px;
    font-weight: bold;
`;

const LeftDays = styled.div`
    font-size: 8px;
    color: white;
    width: 29px;
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 19.5px;
    background-color: #7F52FF;
`;

const DotIcon = styled.img.attrs({
    src: dot,
    alt: "Dot Icon"
})`
    width: 2px;
    height: 2px;
`;

const PartyStatus = styled.div`
    
`;