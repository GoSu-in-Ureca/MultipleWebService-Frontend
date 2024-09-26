import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { increaseExpAndLevel } from "../../function/Exp";
import CategoryItem from "../../components/form/CategoryItem";
import backbutton from "/assets/Icon/navigate_before.svg";

import { addDoc, collection, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { db, storage, auth, database } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, push, set } from "firebase/database";

const UploadForm = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("문화생활");
    const [selectedPictures, setSelectedPictures] = useState([]);
    const [selectedPictureAlert, setSelectedPictureAlert] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [deadline, setDeadline] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [participants, setParticipants] = useState(2);
    const [currentUser, setCurrentUser] = useState(null);

    // 사용자 문서 참조
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const queryCollection = query(collection(db, "users"), where("user_id", "==", auth.currentUser.uid));
            try{
                const userSnapshot = await getDocs(queryCollection);
                const userData = userSnapshot.docs[0].data();

                setCurrentUser(userData);
            } catch (error) {
                console.log(error);
            }
        }

        fetchCurrentUser();
    }, []);

    const allowedExtensions = ["jpg", "jpeg", "png"];

    const validateFile = (file) => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
    }

    const handleIntroNavigate = () => {
        navigate('/main');
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
      };

    const handlePictureUpload = (event) => {
        const files = Array.from(event.target.files);

        const invalidFiles = files.filter((file) => !validateFile(file));
        if (invalidFiles.length > 0) {
            setSelectedPictureAlert("유효한 파일 형식이 아닙니다");
            return;
        }

        if (selectedPictures.length + files.length > 5) {
            setSelectedPictureAlert("파일은 최대 5개까지 업로드 가능합니다")
          return;
        }
        setSelectedPictures((prevPictures) => [...prevPictures, ...files]);
        setSelectedPictureAlert("");
      };

    const handleButtonClick = () => {
        document.getElementById('pictureUploadInput').click();
    };

    const handlePictureClick = (index) => {
        setSelectedPictures((prevPictures) =>
          prevPictures.filter((_, i) => i !== index)
        );
      };

    // 제출
    const handleUpload = async (e) => {
        e.preventDefault();
        const uploadedImageUrls = [];
        const currentDateTime = new Date().toISOString();

        for (const file of selectedPictures) {
            const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
            try {
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                uploadedImageUrls.push(downloadURL);
            } catch (error) {
                console.error('이미지 업로드 중 오류 발생:', error);
                return;
            }
        }

        try {
            // post 문서 추가
            const postRef = await addDoc(collection(db, 'posts'), {
                post_user_id: currentUser.user_id,
                post_user_name: currentUser.user_name,
                post_category: selectedCategory,
                post_title: title,
                post_content: content,
                post_createdAt: currentDateTime,
                post_updatedAt: currentDateTime,
                post_status: true,
                post_deadline: deadline,
                totalPrice: totalPrice,
                post_maxparti: participants,
                post_currentparti: 1,
                post_cost: participants > 0 ? Math.ceil(totalPrice / participants) : 0,
                post_interest: 0,
                post_images: uploadedImageUrls,
                post_view: 0,
                post_liked_users: [],
                post_parti_members: [currentUser.user_id],
            });

            // 채팅방 생성
            const chatRoomRef = databaseRef(database, "chatRoom");
            const newChatRoomRef = push(chatRoomRef);
            const roomId = newChatRoomRef.key;
            await set(newChatRoomRef, {
                room_id: roomId,
                room_name: title,
                room_createdat: new Date().toISOString(),
                room_host: currentUser.user_id,
                room_parti: [currentUser.user_id],
                room_lastMessage: "최근 대화 내역이 존재하지 않습니다",
                room_lastMessagedat: new Date().toISOString(),
                room_thumbnail: uploadedImageUrls[0] || "/assets/BG/defaultImage_m.png",
                messages: {},
            });

            // post에 채팅방 id 추가
            await updateDoc(postRef, {
                post_chatroom_id: roomId,
            });

            // 참여했다는 메세지 전송
            const messagesRef = databaseRef(database, `chatRoom/${roomId}/messages`);
            const messageRef = push(messagesRef);
            const messageData = {
                senderid: "system",
                text: `${currentUser.user_name}(${currentUser.user_department}/${currentUser.user_onoffline})님이 입장하셨습니다.`,
                createdat: new Date().toISOString(),
            };
            await set(messageRef, messageData);
            
            const userSnapshot = await getDocs(
                query(collection(db, "users"), where("user_id", "==", currentUser.user_id)
            ));
            
            if(!userSnapshot.empty){
                const userDoc = userSnapshot.docs[0];
                const userDocId = userDoc.id;
                
                // 사용자 문서 업데이트
                await updateDoc(userSnapshot.docs[0].ref, {
                    user_recruit: increment(1),
                });
                // 경험치와 레벨 증가
                await increaseExpAndLevel(userDocId, 3);
            } else {
                console.log("사용자 문서를 찾을 수 없습니다.");
            }
            
            alert('게시글이 성공적으로 등록되었습니다!');
            navigate(`/chats/${roomId}`);
        } catch (error) {
            console.error('게시글 등록 중 오류 발생:', error);
            alert('게시글 등록에 실패했습니다.');
            return;
        }
    };
    
      const estimatePerMember = participants > 0 ? Math.ceil(totalPrice / participants) : 0;

    // 현재 시각
    const now = new Date().toISOString().slice(0, 16); // 현재 날짜와 시간 형식화
    // 10일 후 시각
    const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

    return (
        <>
            <Wrapper>
                <Header>
                    <BackButton onClick={handleIntroNavigate}/>
                    <Title>게시글 작성</Title>
                </Header>
                <Form onSubmit={handleUpload}>
                    <SettingSubject>카테고리</SettingSubject>
                    <CategoryList>
                        {categories.map((category, index) => (
                            <CategoryItem
                                key={index}
                                category={category}
                                selectedCategory={selectedCategory}
                                onCategorySelect={handleCategorySelect}
                            />
                        ))}
                    </CategoryList>
                    <SettingSubject>사진 등록
                        <PictureLengthAlert>{selectedPictureAlert}</PictureLengthAlert>
                    </SettingSubject>
                    <PictureInputArea>
                        <PictureInputButton onClick={handleButtonClick}/>
                        <PictureUploadInput onChange={handlePictureUpload} />
                        <SelectedPictureWrapper>
                            {selectedPictures.map((file, index) => (
                                <PreviewImage
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt={`Uploaded ${index}`}
                                    onClick={() => handlePictureClick(index)}
                                />
                            ))}
                        </SelectedPictureWrapper>
                    </PictureInputArea>
                    <SettingSubject>제목</SettingSubject>
                    <TitleInputArea value={title} onChange={(e) => setTitle(e.target.value)}/>
                    <SettingSubject>내용</SettingSubject>
                    <ContentInputArea value={content} onChange={(e) => setContent(e.target.value)}/>
                    <SettingSubject>마감 기한 설정</SettingSubject>
                    <DeadLineInput value={deadline} onChange={(e) => setDeadline(e.target.value)}
                                    min={now} max={maxDate}/>
                    <SettingSubject>가격 및 모집 인원</SettingSubject>
                    <PPInputArea>
                        <EstimatePriceArea value={totalPrice}
                                onChange={(e) => setTotalPrice(Number(e.target.value))}>
                            <SubTitle>예상 경비(:원)</SubTitle>
                            <PriceInputArea />
                        </EstimatePriceArea>
                        <MaxParticipantsArea>
                            <SubTitle>모집 인원</SubTitle>
                            <ParticipantsInputArea value={participants}
                                onChange={(e) => setParticipants(Number(e.target.value))}/>
                        </MaxParticipantsArea>
                        <EstimatePricePerMemberArea>
                            <SubTitle>예상 인당 가격</SubTitle>
                            <EstimatePricePerMember>인당 {estimatePerMember}원 이내</EstimatePricePerMember>
                        </EstimatePricePerMemberArea>
                    </PPInputArea>
                    <UploadButton>등록</UploadButton>
                </Form>
            </Wrapper>
        </>
    );
}

export default UploadForm;

// styled components

const Wrapper = styled.div`
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: white;
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

const CategoryList = styled.div`
    width: 372px;
    height: 30px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    margin: 13px 0 0 18px;

    &::-webkit-scrollbar{
        display: none;
    }
`;

const Title = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-left: 122px;
`;

const Form = styled.form``;

const SettingSubject = styled.div`
    font-size: 14px;
    font-weight: 600;
    margin: 30px 0 13px 23px;
`;

const PictureInputArea = styled.div`
    display: flex;
    justify-content: flex-start;
    height: 70px;
    margin-left: 22px;
`;

const PictureInputButton = styled.div`
    width: 70px;
    height: 70px;
    margin-right: 11px;
    background-image: url('/assets/Icon/addfile.svg');

    &:hover{
        cursor: pointer;
    }
`;

const PictureUploadInput = styled.input.attrs({
    id: "pictureUploadInput",
    type: "file",
    multiple: "multiple",
    accept: ".jpg, .jpeg, .png"
})`
    display: none;
`;

const SelectedPictureWrapper = styled.div`
    width: 276px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;

    &::-webkit-scrollbar{
        display: none;
    }
`

const PreviewImage = styled.img`
    width: 70px;
    height: 70px;
    margin-right: 11px;
    border-radius: 8px;
    object-fit: cover;

    &:hover{
        cursor: pointer;
    }
`;

const PictureLengthAlert = styled.span`
    font-size: 8px;
    color: #FF3838;
    margin-left: 10px;
`;

const TitleInputArea = styled.input.attrs({
    type: "text",
    id: "title",
    name: "title",
    placeholder: "제목을 입력해주세요",
    required: "required"
})`
    width: 346px;
    height: 50px;
    border: hidden;
    padding: 10px 20px;
    margin-left: 22px;
    background-color: #F8F8F8;
    border-radius: 7px;
    outline: none;
    font-family: "Pretendard";
    font-size: 12px;
    font-weight: 300;

    &::placeholder{
        font-size: 12px;
        color: #BCBEC0;
    }
`;

const ContentInputArea = styled.textarea.attrs({
    type: "text",
    id: "content",
    name: "content",
    placeholder: "상세 정보를 입력해주세요 (마크다운 문법 지원)",
    required: "required"
})`
    font-family: "Pretendard";
    font-weight: 300;
    width: 346px;
    height: 220px;
    resize: none;
    border: hidden;
    padding: 20px;
    margin-left: 22px;
    background-color: #F8F8F8;
    border-radius: 7px;
    outline: none;
    font-size: 12px;

    &::placeholder{
        font-size: 12px;
        color: #BCBEC0;
    }
`;

const DeadLineInput = styled.input.attrs({
    type: "datetime-local",
    id: "deadline",
    name: "deadline",
    required: "required"
})`
    width: 160px;
    height: 30px;
    padding: 7px 10px;
    margin-left: 22px;
    box-sizing: border-box;
    border: 1px solid black;
    border-radius: 6px;
    font-size: 10px;
`;

const UploadButton = styled.button.attrs({
    type: "submit"
})`
    width: 346px;
    height: 42px;
    border-radius: 8px;
    border: hidden;
    background-color: #7F52FF;
    color: white;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 22px;
    margin-bottom: 35px;

    &:hover{
        cursor: pointer;
    }
`;

const PPInputArea = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 22px;
    justify-content: space-between;
`;

const SubTitle = styled.div`
    font-size: 11px;
    color: #676767;
    margin-bottom: 6px;
`;

const EstimatePriceArea = styled.div`
    width: 160px;
    margin-bottom: 20px;
`;

const PriceInputArea = styled.input.attrs({
    type: "number",
    id: "totalprice",
    name: "totalprice",
    required: "required",
    min: "0"
})`
    width: 160px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid black;

    appearance: textfield; /* Chrome, Safari, Edge */

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none; /* Chrome, Safari, Edge */
        margin: 0;
    }
`;

const MaxParticipantsArea = styled.div`
    width: 160px;
    margin-bottom: 20px;
`;

const ParticipantsInputArea = styled.input.attrs({
    type: "number",
    id: "participants",
    name: "participants",
    required: "required",
    min: "2",
    max: "10",
})`
    width: 160px;
    height: 30px;
    border-radius: 6px;
    border: 1px solid black;
    outline: none;
`;

const EstimatePricePerMemberArea = styled.div`
    width: 346px;
    margin-bottom: 44px;
`;

const EstimatePricePerMember = styled.div`
    font-size: 14px;
    font-weight: 700;
`;

// categoryList
const categories = [
    "문화생활", "운동",
    "공구", "맛집탐방", "여행",
    "쇼핑", "택시", "스터디", "기타"
];
