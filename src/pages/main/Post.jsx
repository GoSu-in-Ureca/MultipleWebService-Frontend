import React, { useRef, useState, useEffect } from "react";
import Loading from "../../Loading.jsx";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import PrevButton from "/assets/Icon/navigate_before.svg";
import Heart from "/assets/Icon/heart-color.svg";
import More from "/public/assets/Icon/More.svg";
import leftArrow from "/assets/Icon/photoArrowL.svg";
import rightArrow from "/assets/Icon/photoArrowR.svg";

import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Post = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const {postId} = useParams();
    const [post, setPost] = useState(null);


    const [isDrag, setIsDrag] = useState(false);
    const [startX, setStartX] = useState();
    const onDragStart = e => {
        e.preventDefault();
        setIsDrag(true);
        setStartX(e.pageX + scrollRef.current.scrollLeft);
    };

    const onDragEnd = () => {
        setIsDrag(false);
    };

    const onDragMove = e => {
        if(isDrag){
            const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;

            scrollRef.current.scrollLeft = startX - e.pageX;

            if(scrollLeft === 0){
                setStartX(e.pageX);
            } else if(scrollWidth <= clientWidth + scrollLeft){
                setStartX(e.pageX + scrollLeft);
            }
        }
    }

    const throttle = (func, ms) => {
        let throttled = false;
        return (...args) => {
            if(!throttled){
                throttled = true;
                setTimeout(()=>{
                    func(...args);
                    throttled = false;
                }, ms);
            }
        }
    }

    const delay = 50;
    const onThrottleDragMove = throttle(onDragMove, delay);

    // 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postRef = doc(db, "posts", postId);
                const postSnapshot = await getDoc(postRef);

                if(postSnapshot.exists){
                    setPost(postSnapshot.data());
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchPost();
    },[postId]);

    // 작성 시간 계산 메서드
    const getTimeDifference = (createdAt) => {
        const postDate = new Date(createdAt);
        const now = new Date();
        const diff = (now - postDate) / 1000;

        if(diff < 3600) return `${Math.floor(diff / 60)}분 전`;
        if(diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
        return `${Math.floor(diff / 86400)}일 전`;
    }

    // 마감일 계산
    const calculateLeftDays = (deadLineDate) => {
        const now = new Date();
        const difference = (deadLineDate - now) / (1000*60*60*24);
        
        return difference >= 0 ? Math.floor(difference) : "마감";
    }
    const [leftDays, setLeftDays] = useState(calculateLeftDays);
    useEffect(() => {
        setLeftDays(calculateLeftDays());
    }, [Date.now()]);

    if (!post) { // 게시글 데이터 불러오기 전까지 보여줌
        return <Loading />;
    }

    // 작성일 마감일 format 메서드
    const formatDate = (dateString) => {
        let date;

        // 날짜 문자열의 자릿수를 확인하고 Date 객체 생성 방식 결정
        if (dateString.length === 16) { // "2024-09-15T16:18" 형식
            date = new Date(dateString);
        } else if (dateString.length === 24) { // "2024-09-14T07:18:26.051Z" 형식
            date = new Date(dateString);
        } else {
            return '';
        }
    
        const padZero = (num) => num.toString().padStart(2, '0');
    
        const year = date.getFullYear().toString().slice(-2); // 두 자리 연도
        const month = padZero(date.getMonth() + 1); // 월 (0부터 시작하므로 +1)
        const day = padZero(date.getDate()); // 일
        const hours = padZero(date.getHours()); // 시
        const minutes = padZero(date.getMinutes()); // 분
    
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    const handleBackClick = () => {
        navigate(-1);
    }
    
    return (
        <>
            <Wrapper>
                <Header onClick={handleBackClick}>
                    <img src={PrevButton}/>
                </Header>
                <ImageSlider 
                    onMouseDown={onDragStart} 
                    onMouseMove={isDrag ? onThrottleDragMove : null}
                    onMouseUp={onDragEnd}
                    onMouseLeave={onDragEnd}
                    ref={scrollRef}
                    >
                    <LeftRightButton>
                        <Button><img src={leftArrow}/></Button>
                        <Button><img src={rightArrow}/></Button>
                    </LeftRightButton>
                    <ImageInner>
                        <Image/>
                        <Image/>
                        <Image/>
                    </ImageInner>
                </ImageSlider>
                <TagsAndWriteTime>
                    <Tags>
                        <Tag style={{backgroundColor:"#7F52FF", color:"white", fontSize:"12px"}} $isexpired={leftDays === '마감'}>
                            {leftDays === "마감" ? "마감" : `D-${leftDays}`}
                        </Tag>
                        <Tag style={{backgroundColor:"white", border:"1px solid #808284", color:"#404041", fontSize:"12px"}}>
                            {post.post_category}
                        </Tag>
                        <Tag style={{display:'flex', gap: '2px',backgroundColor:"white", border:"1px solid #808284", color:"#404041", fontSize:"12px"}}>
                            <img src={Heart} style={{width: "12px"}}/>
                            {post.post_interest}
                        </Tag>
                    </Tags>
                    <WriteTime>
                        {getTimeDifference(post.post_createdAt)}
                    </WriteTime>
                </TagsAndWriteTime>
                <ContentTop>
                    <TitleAndImg>
                        <Title>{post.post_title}</Title>
                        <img src={More} style={{transform:"rotate(90deg)"}}/>
                    </TitleAndImg>
                    <Writer>
                        <span>작성자</span> 
                        <WriterName>
                            <span>{post.post_user_name}</span> 
                            <span style={{color:"#DADADA"}}>프론트엔드/대면</span>
                        </WriterName>
                    </Writer>
                    <Time>
                        <span>모집기간</span> 
                        <span>{formatDate(post.post_createdAt)} ~ {formatDate(post.post_deadline)}</span>
                    </Time>
                </ContentTop>
                <SubmitArea>
                    <PriceAndPeopleNum>
                        <div>
                            <span style={{color:'#7F52FF', fontSize:'18px'}}>약 {post.post_cost}원~</span><span style={{color:'#676767', fontSize:'12px'}}>/인</span>
                        </div>
                        <PeopleNum>
                            <span>참여인원</span><span>{post.post_currentparti}명 / {post.post_maxparti}명</span>
                        </PeopleNum>
                    </PriceAndPeopleNum>
                    <Participate >참여하기</Participate>
                </SubmitArea>
            </Wrapper>
        </>
    );
}

export default Post;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 100%;
    max-width: 390px;
    height: 100vh;
`;

const Header = styled.div`
    width: 390px;
    height: 52px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    box-sizing: border-box;

    &:hover{
        cursor: pointer;
    }
`;

const ImageSlider = styled.div`
    /* overflow-x: scroll;
    &::-webkit-scrollbar{
        display: none;
    } */
    overflow: hidden;
    width: 390px;
    height: 326px;
    display: flex;
    align-items: center;
    position: relative;
    `;

const ImageInner = styled.div`
    display: flex;
    width: fit-content;
    padding-left: 20px;
    padding-right: 20px;
    
`;

const Image = styled.div`
  width: 326px;
  height: 326px;
  background-color: gray;
  border-radius: 11px;
  margin: 0px 10px 0px 10px;
  display: flex;
  align-items: center;
  background: url(../../../public/assets/BG/ProfileExample.svg);
  background-repeat: no-repeat;
  background-size: cover;
  `;

const LeftRightButton = styled.div`
      display: flex;
      justify-content: space-between;
      gap: 290px;
      margin: 17px;
      align-items: center;
      position: fixed;
  `;

const Button = styled.div`
    cursor: pointer;
`;

const TagsAndWriteTime = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 25px;
  padding-left: 22px;
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  `;

const Tag = styled.div`
    background-color: gray;
    padding: 6px 14px 6px 14px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;


const WriteTime = styled.div`
    font-size: 12px;
    color:#BCBEC0;
    margin-right: 22px;
    display: flex;
    align-items: center;
`;

const ContentTop = styled.div`
  padding: 22px 14px 22px 22px;
  border-bottom: 4px solid #F4F4F4;
`;

const TitleAndImg =styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 24px;
`;

const Writer = styled.div`
    margin-top: 18px;
    display: flex;
    gap: 45px;
    font-size: 14px;
`;

const WriterName = styled.div`
  display: flex;
  gap: 12px;
`;

const Time = styled.div`
  margin-top: 9px;
  display: flex;
  gap: 32px;
  font-size: 14px;
`;

const SubmitArea = styled.div`
    width: 390px;
    height: 136px;
    background-color: white;
    padding: 22px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    box-shadow: 0px -5px 5px -5px #E2E2E2;
`;

const PriceAndPeopleNum = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
`;

const PeopleNum = styled.div`
    font-size: 12px;
    color: #676767;
    display: flex;
    gap: 10px;
`;

const Participate = styled.div`
    width: 346px;
    height: 42px;
    background-color: #7F52FF;
    color: white;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
`;