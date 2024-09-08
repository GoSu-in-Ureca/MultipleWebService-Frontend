import styled from "styled-components";
import PostItem from "./PostItem";

const PostList = () => {
    return (
        <>
            <Wrapper>
                {PostDatas.map((PostData, index) => (
                    <PostItem key={index} post={PostData}/>
                ))}
            </Wrapper>
        </>
    );
}

export default PostList;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100px;
`;

// dummy datas

const PostDatas = [
    {
      title: "주말 요리 대회 참가자 모집",
      content: "다양한 요리 실력을 뽐낼 수 있는 요리 대회에 참가해보세요!",
      interests: 20,
      author: "chefMaster",
      deadline: "2024-09-18",
      category: "요리",
      image: "/assets/images/cooking.jpg",
    },
    {
      title: "도심 속 자전거 라이딩",
      content: "주말 아침, 도심에서 자전거를 타며 건강을 챙겨요.",
      interests: 15,
      author: "cyclePro",
      deadline: "2024-09-21",
      category: "운동",
      image: "/assets/images/city-cycling.jpg",
    },
    {
      title: "디지털 드로잉 클래스",
      content: "아이패드와 펜슬로 배우는 디지털 드로잉, 기초부터 시작해봐요!",
      interests: 28,
      author: "artLover",
      deadline: "2024-09-25",
      category: "미술",
      image: "/assets/images/drawing.jpg",
    },
    {
      title: "해변에서 요가와 명상",
      content: "바닷가의 평온한 파도 소리와 함께하는 요가와 명상 시간.",
      interests: 12,
      author: "beachZen",
      deadline: "2024-09-23",
      category: "운동",
      image: "/assets/images/beach-yoga.jpg",
    },
    {
      title: "영화 리뷰 클럽",
      content: "매주 새로 개봉하는 영화를 보고 리뷰를 나누는 영화 클럽 모임.",
      interests: 18,
      author: "movieCritic",
      deadline: "2024-09-19",
      category: "문화",
      image: "/assets/images/movie-club.jpg",
    },
    {
      title: "전통 공예 체험",
      content: "전통 공예를 체험하며 새로운 취미를 가져보세요.",
      interests: 22,
      author: "craftMaster",
      deadline: "2024-09-24",
      category: "취미",
      image: "/assets/images/craft.jpg",
    },
    {
      title: "트레일 러닝 팀 모집",
      content: "산길을 달리며 자연을 만끽하는 트레일 러닝, 함께 달려요!",
      interests: 25,
      author: "trailRunner",
      deadline: "2024-09-20",
      category: "운동",
      image: "/assets/images/trail-running.jpg",
    },
    {
      title: "사진 촬영 워크숍",
      content: "야외에서 직접 촬영하며 배우는 사진 촬영 기법 워크숍.",
      interests: 16,
      author: "photoGuru",
      deadline: "2024-09-22",
      category: "사진",
      image: "/assets/images/photography-workshop.jpg",
    },
    {
      title: "커피 브루잉 클래스",
      content: "핸드드립 커피 브루잉을 배우며 나만의 커피를 만들어봐요.",
      interests: 10,
      author: "coffeeBrewer",
      deadline: "2024-09-26",
      category: "미식",
      image: "/assets/images/coffee-brewing.jpg",
    },
    {
      title: "야경 촬영 스터디",
      content: "도시의 야경을 담아내는 야경 촬영 스터디 그룹에 참가하세요.",
      interests: 14,
      author: "nightSnapper",
      deadline: "2024-09-27",
      category: "사진",
      image: "/assets/images/night-photography.jpg",
    },
  ];
  