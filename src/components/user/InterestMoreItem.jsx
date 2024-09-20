import styled from "styled-components";
import dot from "/assets/Icon/dot.svg";
import { useNavigate } from "react-router-dom";

const InterestMoreItem = ({post}) => {
    const navigate = useNavigate();
    const deadLineDate = new Date(post.post_deadline);
    const leftDays = Math.ceil((deadLineDate-Date.now()) / (1000*60*60*24));

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
        <>
            <Wrapper onClick={handlePostClick}>
            <ProfileImage src={post.post_images[0] || "/assets/BG/defaultImage.png"}/>
                <MainArea>
                    <TextArea>
                        {post.post_title}
                    </TextArea>
                    <Content>{post.post_content}</Content>
                    <InfoArea>
                        <LeftDays $isExpired={leftDays <= 0}>{leftDays > 0 ? `D-${leftDays}` : "마감"}</LeftDays>
                        <DotIcon />
                        <SubText>{post.post_user_name}</SubText>
                        <DotIcon />
                        <PartyStatus>참여 인원 <span style={{color: "#7F52FF"}}>{post.post_currentparti}</span> / {post.post_maxparti}</PartyStatus>
                    </InfoArea>
                </MainArea>
            </Wrapper>
        </>
    );
}

export default InterestMoreItem;

// styled components

const Wrapper = styled.div`
    display:  flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    padding: 16px 0 22px 0;
    border-bottom: 1px solid #F5F5F5;

    &:hover{
        background-color: #F7F7F7;
        cursor: pointer;
    }
`;

const ProfileImage = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 11px;
    background-color: gray;
    margin-left: 20px;
    margin-right: 13px;
    align-self: center;
`;

const MainArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const TextArea = styled.div`
    font-size: 16px;
    font-weight: bold;
    width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    width: 170px;
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
    background-color: ${props => props.$isExpired ? "#BCBEC0" : "#7F52FF"};
`;

const DotIcon = styled.img.attrs({
    src: dot,
    alt: "Dot Icon"
})`
    width: 2px;
    height: 2px;
`;

const SubText = styled.div`
    
`;
const PartyStatus = styled.div`
    
`;