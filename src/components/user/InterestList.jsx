import styled from "styled-components";
import Image from "/assets/BG/ProfileExample2.jpg";
import heart from "/assets/Icon/heart-fill.svg";
import { useNavigate } from 'react-router-dom';

const InterestList = () => {
    const navigate = useNavigate();

    const handleHeartPostListNavigate = () => {
        navigate('/user/interest')
    }

    return (
        <Wrapper>
            <HeartPost>
                <HeartPostTitle>내가 찜한 게시글</HeartPostTitle>
                <WholeView onClick={handleHeartPostListNavigate}>전체보기</WholeView>
            </HeartPost>
            <HeartPostContent>
                <Content>
                    <Photo>
                        <Dday>
                            D-3
                        </Dday>
                        <HeartBox>
                            <HeartIcon/>
                            <HeartNum>13</HeartNum>
                        </HeartBox>
                    </Photo>
                    <Title>평양냉면 도장깨기 함께 가실분</Title>
                    <ProfileAndWriter>
                        <Profile/>
                        <Writer>고윤정</Writer>
                    </ProfileAndWriter>
                </Content>
                <Content>
                    <Photo>
                        <Dday> 
                            D-3
                        </Dday>
                        <HeartBox>
                            <HeartIcon/>
                            <HeartNum>13</HeartNum>
                        </HeartBox>
                    </Photo>
                    <Title>평양냉면 도장깨기 함께 가실분</Title>
                    <ProfileAndWriter>
                        <Profile/>
                        <Writer>고윤정</Writer>
                    </ProfileAndWriter>
                </Content>
                <Content>
                    <Photo>
                        <Dday>
                            D-3
                        </Dday>
                        <HeartBox>
                            <HeartIcon/>
                            <HeartNum>13</HeartNum>
                        </HeartBox>
                    </Photo>
                    <Title>평양냉면 도장깨기 함께 가실분</Title>
                    <ProfileAndWriter>
                        <Profile/>
                        <Writer>고윤정</Writer>
                    </ProfileAndWriter>
                </Content>
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
    gap: 15px;
    overflow-x: scroll;
    scrollbar-width: none;
`;

const Content = styled.div`
    
`;

const Photo = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 11px;
    background: url(/assets/BG/BackGroundExample.png);
    background-repeat: no-repeat;
    background-size: cover;
    padding: 8px;
    display: flex;
    flex-direction: column;
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
`;

const HeartBox = styled.div`
    display: flex;
    gap: 2px;
    align-items: center;
`;

const HeartIcon = styled.img.attrs({
    src: heart,
    alt: "heart icon"
})`
    
`;

const HeartNum = styled.div`
    font-family: 'Pretendard-Regular';
    font-size: 9px;
    color: white;
`;

const Title = styled.div`
    font-family: 'Pretendard-SemiBold';
    font-size: 12px;
    width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 8px 0px 6px 0px;
`;

const ProfileAndWriter = styled.div`
    display: flex;
    gap: 4px;
`;

const Profile = styled.img.attrs({
    src: Image,
    alt: "Profile Image"
})`
    width: 15px;
    height: 15px;
    border-radius: 15px;
`;

const Writer = styled.div`
    font-family: 'Pretendard-Regular';
    font-size: 11px;
`;
