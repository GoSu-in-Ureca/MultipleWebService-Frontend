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
    width: 372px;
    height: 39px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    margin: 25px 0 30px 18px;

    &::-webkit-scrollbar{
        display: none;
    }
`;

// categoryList
const categories = [
    "전체", "운동", "문화생활",
    "공구", "맛집탐방", "여행",
    "쇼핑", "택시", "스터디"
];
