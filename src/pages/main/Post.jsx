import React, { useRef, useState } from "react";
import styled from "styled-components";
import PrevButton from "/assets/Icon/navigate_before.svg";
import BigHeart from "/assets/Icon/heart-color.svg";
import Heart from "/assets/Icon/heart-gray.svg";
import View from "/assets/Icon/view.svg";
import More from "/public/assets/Icon/More.svg";
import leftArrow from "/assets/Icon/photoArrowL.svg";
import rightArrow from "/assets/Icon/photoArrowR.svg";
import { useNavigate } from 'react-router-dom';

const Post = () => {
    const navigate = useNavigate();

    const handleBackNavigate = () => {
        navigate('/main')
    }
    
    const handleParticipateNavigate = () => {
        navigate('/main')
    }

    const scrollRef = useRef(null);
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
    
    return (
        <>
            <Wrapper>
                <Header>
                    <img src={PrevButton} onClick={handleBackNavigate} style={{cursor: 'pointer'}}/>
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
                        <DdayTag>
                            D-3
                        </DdayTag>
                        <CatagoryTag>
                            맛집탐방
                        </CatagoryTag>
                    </Tags>
                    <WriteTime>
                        30분전
                    </WriteTime>
                </TagsAndWriteTime>
                <HeartAndView>
                    <HeartTag>
                        <img src={Heart}/>
                        <span>13</span>
                    </HeartTag>
                    <ViewTag>
                        <img src={View}/>
                        <span>20</span>
                    </ViewTag>
                </HeartAndView>
                <ContentTop>
                    <TitleAndImg>
                        <Title>평양냉면 도장깨기 함께 하실 분</Title>
                        <img src={More} style={{transform:"rotate(90deg)"}}/>
                    </TitleAndImg>
                    <Writer>
                        <span>작성자</span> 
                        <WriterName>
                            <span>고윤정</span> 
                            <span style={{color:"#DADADA"}}>프론트엔드/대면</span>
                        </WriterName>
                    </Writer>
                    <Time>
                        <span>모집기간</span> 
                        <span>24.09.05 17:00 ~ 24.09.09 18:00</span>
                    </Time>
                    <PeopleNum>
                        <span>참여인원</span>
                        <span><Highlight>0명 </Highlight>/ 4명</span>
                    </PeopleNum>
                    <Price>
                        <span>가격</span>
                        <span>
                            <Highlight>약 16,000원~</Highlight>
                            <span>/인</span>
                        </span>
                    </Price>
                </ContentTop>
                <SubmitArea>
                    <HeartButton>
                        <img src={Heart} />
                    </HeartButton>
                    <Participate>참여하기</Participate>
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
    font-family: 'Pretendard-Regular';
  `;

const DdayTag = styled.div`
    background-color: #7F52FF;
    padding: 6px 14px 6px 14px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 12px;
`;

const CatagoryTag = styled.div`
    background-color: white;
    padding: 6px 14px 6px 14px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #808284;
    color: #404041;
    font-size: 12px;
`;

const HeartAndView = styled.div`
    display: flex;
    gap: 20px;
    padding: 10px 0px 0px 25px;
    color: #BCBEC0;
    font-family: 'Pretendard-Regular';
    font-size: 10px;
`;

const HeartTag = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 10px;
    width: 10px;
`;

const ViewTag = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 10px;
    width: 12px;
`;

const WriteTime = styled.div`
    font-size: 12px;
    color:#BCBEC0;
    margin-right: 22px;
    display: flex;
    align-items: center;
`;

const ContentTop = styled.div`
  padding: 4px 14px 25px 25px;
  border-bottom: 4px solid #F4F4F4;
  font-family: 'Pretendard-Medium';
  color: #676767;
  font-size: 12px;
`;

const TitleAndImg =styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 24px;
  font-family: 'Pretendard-SemiBold';
  color: black;
`;

const Writer = styled.div`
    margin-top: 18px;
    display: flex;
    gap: 43px;
    
`;

const WriterName = styled.div`
  display: flex;
  gap: 12px;
`;

const Time = styled.div`
  margin-top: 9px;
  display: flex;
  gap: 32px;
`;


const PeopleNum = styled.div`
    display: flex;
    gap: 32px;
    align-items: center;
    margin-top: 9px;
    `;

const Price = styled.div`
    display: flex;
    align-items: center;
    gap: 52px;
    margin-top: 9px;
    `;

const Highlight = styled.span`
    font-family: 'Pretendard-SemiBold';
    color: #7F52FF;
    `;

const SubmitArea = styled.div`
    width: 390px;
    height: 78px;
    background-color: white;
    padding: 18px 22px 18px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    box-shadow: 0px -5px 5px -5px #E2E2E2;
    display: flex;
    align-items: center;
    gap: 14px;
`;

const HeartButton = styled.div`
    margin: auto;
    width: 20px;
`;

const Participate = styled.div`
    width: 312px;
    height: 42px;
    background-color: #7F52FF;
    color: white;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
`;