import styled from "styled-components";
import HotPostItem from "./HotPostItem";

const HotPostList = () => {
    return (
        <>
            <Wrapper>
                {HotPostDatas.map((HotPostData, index) => (
                    <HotPostItem key={index} HotPost={HotPostData} />
                ))}
            </Wrapper>
        </>
    );
}

export default HotPostList;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    width: 372px;
    height: 185px;
    margin: 15px 0 0 18px;

    &::-webkit-scrollbar{
        display: none;
    }
`;




// dummy datas

const HotPostDatas = [
    {
      title: "주말 캠핑 동호회 모집",
      content: "자연 속에서 힐링할 캠핑 멤버들을 찾고 있어요. 초보도 환영!",
      interests: 18,
      author: "forestAdventurer",
      deadline: "2024-09-15",
      category: "야외활동",
      image: "/assets/images/camping.jpg",
    },
    {
      title: "프랑스어 언어 교환",
      content: "프랑스어 배우고 싶으신 분, 언어 교환하며 실력을 키워봐요!",
      interests: 30,
      author: "lingoMaster",
      deadline: "2024-09-20",
      category: "언어",
      image: "/assets/images/french.jpg",
    },
    {
      title: "도시 탐방 사진 워크샵",
      content: "도시의 숨겨진 모습을 카메라에 담아봐요. 사진 초보자도 환영!",
      interests: 21,
      author: "urbanExplorer",
      deadline: "2024-09-18",
      category: "사진",
      image: "/assets/images/photography.jpg",
    },
    {
      title: "비건 요리 클래스",
      content: "비건 요리에 관심 있는 분들을 위한 맛있는 요리 수업!",
      interests: 14,
      author: "plantChef",
      deadline: "2024-09-19",
      category: "요리",
      image: "/assets/images/vegan.jpg",
    },
    {
      title: "새벽 러닝 모임",
      content: "아침에 일찍 일어나 러닝으로 하루를 시작해봐요. 건강도 챙기고 기분도 업!",
      interests: 23,
      author: "morningRunner",
      deadline: "2024-09-17",
      category: "운동",
      image: "/assets/images/running.jpg",
    },
    {
      title: "고전 소설 독서 토론",
      content: "고전 소설을 읽고 함께 깊이 있는 토론을 나눠보아요.",
      interests: 26,
      author: "bookworm90",
      deadline: "2024-09-22",
      category: "독서",
      image: "/assets/images/classicbooks.jpg",
    },
    {
      title: "매주 수학 문제 도전!",
      content: "수학을 사랑하는 사람들이 모여 매주 새로운 문제에 도전합니다.",
      interests: 17,
      author: "mathGenius",
      deadline: "2024-09-16",
      category: "스터디",
      image: "/assets/images/math.jpg",
    },
    {
      title: "힙한 카페 탐방 모임",
      content: "도시 속 감성 넘치는 카페를 함께 찾아가요. 새로운 공간을 만나봐요!",
      interests: 29,
      author: "coffeeLover",
      deadline: "2024-09-23",
      category: "미식",
      image: "/assets/images/cafe.jpg",
    },
    {
      title: "명상과 요가 힐링 타임",
      content: "바쁜 일상 속에서 잠시 멈추고 명상과 요가로 힐링하는 시간.",
      interests: 11,
      author: "zenMaster",
      deadline: "2024-09-21",
      category: "운동",
      image: "/assets/images/meditation.jpg",
    },
    {
      title: "주말 자전거 여행",
      content: "도심을 벗어나 자전거를 타고 시원하게 달려보세요!",
      interests: 20,
      author: "bikeFanatic",
      deadline: "2024-09-25",
      category: "야외활동",
      image: "/assets/images/cycling.jpg",
    },
  ];
