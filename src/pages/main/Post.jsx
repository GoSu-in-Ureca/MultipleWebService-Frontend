import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Loading from "../../Loading.jsx";
import PrevButton from "/assets/Icon/navigate_before.svg";
import Heart from "/assets/Icon/heart-gray.svg";
import HeartBlack from "/assets/Icon/heart-black.svg";
import View from "/assets/Icon/view.svg";
import More from "/public/assets/Icon/More.svg";
import Modal from "../../components/main/Modal.jsx";

import { db, auth } from "../../firebase";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";

const Post = () => {
    const navigate = useNavigate();

    const {postId} = useParams();
    const [user, setUser] = useState(auth.currentUser);
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInteresting, setIsInteresting] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // 모달 창
    const [modalPosition, setModalPosition] = useState({top:0, left:0}); // 모달 위치

    const modalButtonRef = useRef(null); // 미트볼 아이콘 위치 참조

    // 모달 위치 설정
    const handleModalClick = () => {
        const rect = modalButtonRef.current.getBoundingClientRect();
        setModalPosition({top: rect.top + window.scrollY, left: rect.left+window.scrollX}); // 모달 위치
        setIsOpen(true); // 모달 열기
    }

    // 게시글 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postRef = doc(db, "posts", postId);
                const postSnapshot = await getDoc(postRef);

                if(postSnapshot.exists){
                    const postData = postSnapshot.data();
                    setPost(postData);

                    if (postData.post_liked_users && postData.post_liked_users.includes(user.uid)) {
                        setIsInteresting(true);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchPost();
    },[postId]);

    // 작성자 불러오기
    useEffect(() => {
        const fetchUser = async () => {
            if (!post || !post.post_user_id) return;

            try {
                const queryCollection = query(collection(db, 'users'), where('user_id', '==', post.post_user_id));
                const querySnapshot = await getDocs(queryCollection);

                if(!querySnapshot.empty){
                    const userData = querySnapshot.docs[0].data();
                    setAuthor({ ...userData, id: querySnapshot.docs[0].id });
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchUser();
    }, [post]);

    // 데이터 완전히 로드 대기
    useEffect(() => {
        if(post && author) {
            setLoading(false);
        }
    }, [post, author])

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
    const calculateLeftDays = (deadLine) => {
        const deadLineDate = new Date(deadLine);
        const now = new Date();
        const difference = (deadLineDate - now) / (1000*60*60*24);
        
        return difference >= 0 ? Math.floor(difference) : "마감";
    }

    const [leftDays, setLeftDays] = useState(calculateLeftDays);

    useEffect(() => {
        if(post && post.post_deadline){
            setLeftDays(calculateLeftDays(post.post_deadline));
        }
    }, [post]);

    if (loading) { // 게시글 데이터 불러오기 전까지 보여줌
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

    // 하트 클릭 시
    const handleHeartClick = async () => {
        if(!post){
            return ;
        }

        try {
            const postDocRef = doc(db, "posts", postId);
            if(isInteresting){
                setIsInteresting(false);
                await updateDoc(postDocRef, {post_interest: increment(-1), post_liked_users: arrayRemove(user.uid)});
                setPost(prev => ({
                    ...prev,
                    post_interest: prev.post_interest - 1,
                    post_liked_users: prev.post_liked_users.filter(uid => uid !== user.uid)
                }));
            } else {
                setIsInteresting(true);
                await updateDoc(postDocRef, {post_interest: increment(1), post_liked_users: arrayUnion(user.uid)});
                setPost(prev => ({
                    ...prev,
                    post_interest: prev.post_interest + 1,
                    post_liked_users: [...prev.post_liked_users, user.uid]
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 파티 참여 핸들러
    const handleJoinClick = () => {
        try {

        } catch (error) {

        } finally {
            navigate(`/chats/`);
        }
    }

    const handleAuthorClick = () => {
        navigate(`/user/main/${author.id}`);
    }

    const handleBackClick = () => {
        navigate(-1);
    }

    return (
        <>
            <Wrapper>
                <Header>
                    <img src={PrevButton} onClick={handleBackClick} style={{cursor: 'pointer'}}/>
                </Header>
                <ImageSlider>
                    <ImageInner>
                        {post.post_images.length > 0 ? post.post_images.map((image, index) => (
                            <Image src={image}/>
                        )) : <Image src={"/assets/BG/defaultImage.png"} />}
                    </ImageInner>
                </ImageSlider>
                <TagsAndWriteTime>
                    <Tags>
                        <DdayTag $isexpired={leftDays === '마감'}>
                            {leftDays === "마감" ? "마감" : `D-${leftDays}`}
                        </DdayTag>
                        <CatagoryTag>
                            {post.post_category}
                        </CatagoryTag>
                    </Tags>
                    <WriteTime>
                        {getTimeDifference(post.post_createdAt)}
                    </WriteTime>
                </TagsAndWriteTime>
                <HeartAndView>
                    <HeartTag>
                        <img src={Heart}/>
                        <span>{post.post_interest}</span>
                    </HeartTag>
                    <ViewTag>
                        <img src={View}/>
                        <span>{post.post_view}</span>
                    </ViewTag>
                </HeartAndView>
                <ContentTop>
                    <TitleAndImg>
                        <Title>{post.post_title}</Title>
                        <img 
                            src={More} 
                            style={{transform:"rotate(90deg)", cursor:"pointer"}}
                            ref={modalButtonRef}
                            onClick={handleModalClick} // 클릭 시 모달 열기
                        />
                        <Modal 
                            isOpen={isOpen} 
                            onClose={()=>setIsOpen(false)}
                            modalPosition={modalPosition} // 모달 위치 props 전달
                        />
                    </TitleAndImg>
                    <Writer>
                        <span>작성자</span> 
                        <WriterName>
                            <Author onClick={handleAuthorClick}>{post.post_user_name}</Author> 
                            <span style={{color:"#DADADA"}}>{author.user_department}/{author.user_onoffline}</span>
                        </WriterName>
                    </Writer>
                    <Time>
                        <span>모집기간</span> 
                        <span>{formatDate(post.post_createdAt)} ~ {formatDate(post.post_deadline)}</span>
                    </Time>
                    <PeopleNum>
                        <span>참여인원</span>
                        <span><Highlight>{post.post_currentparti}명 </Highlight>/ {post.post_maxparti}명</span>
                    </PeopleNum>
                    <Price>
                        <span>가격</span>
                        <span>
                            <Highlight>약 {post.post_cost}원~</Highlight>
                            <span>/인</span>
                        </span>
                    </Price>
                </ContentTop>
                <ContentMiddle>{post.post_content}</ContentMiddle>
                <SubmitArea>
                    <HeartIcon src={isInteresting ? HeartBlack : Heart}
                                onClick={handleHeartClick} />
                    <Participate $isexpired={leftDays === '마감'} onClick={handleJoinClick}>참여하기</Participate>
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
    margin-bottom: 78px;
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
    overflow: hidden;
    overflow-x: auto;
    scrollbar-width: none;
    width: 350px;
    height: 326px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    margin-left: 20px;
    margin-right: 20px;
`;

const ImageInner = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 10px;
`;

const Image = styled.img`
    width: 350px;
    height: 326px;
    background-color: gray;
    border-radius: 11px;
    display: flex;
    align-items: center;
    object-fit: cover;
    object-position: center;
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
    background-color:  ${(props) => (props.$isexpired ? "#808080" : "#7f52ff")};
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

const ContentMiddle = styled.div`
    min-height: calc(100vh - 650px);
    padding: 25px;
    border-bottom: 4px solid #F4F4F4;
    font-family: 'Pretendard-Medium';
    color: #676767;
    font-size: 12px;
`;

const TitleAndImg =styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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
    padding: 18px 22px;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    box-shadow: 0px -5px 5px -5px #E2E2E2;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HeartIcon = styled.img`
    width: 20px;
    height: 20px;

    &:hover{
        cursor: pointer;
    }
`;

const Participate = styled.div`
    width: 312px;
    height: 42px;
    background-color: ${(props) => (props.$isexpired ? "#808080" : "#7f52ff")};
    color: white;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;

    &:hover{
        cursor: ${(props) => (props.$isexpired ? "" : "pointer")};
    }
`;

const Author = styled.div`
    &:hover {
        cursor: pointer;
    }
`