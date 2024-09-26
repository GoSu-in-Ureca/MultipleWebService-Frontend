import styled from "styled-components";
import CategoryItem from "./CategoryItem";

const CategoryList = () => {
    return (
        <>
            <Wrapper>
                {categories.map((category, index) => (
                    <CategoryItem key={index} category={category}/>
                ))}
            </Wrapper>
        </>
    );
}

export default CategoryList;

// styled components

const Wrapper = styled.div`
    font-weight: 400;
    font-size: 12px;
    width: 372px;
    height: 30px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    margin: 25px 0 25px 18px;

    &::-webkit-scrollbar{
        display: none;
    }
`;

// categoryList
const categories = [
    "전체", "문화생활", "운동",
    "공구", "맛집탐방", "여행",
    "쇼핑", "택시", "스터디", "기타"
];
