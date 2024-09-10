import React, { useState } from "react";
import styled from "styled-components";
import CategoryItem from "../form/CategoryItem";

const CategoryList = () => {
  const [selectedCategory, setSelectedCategory] = useState("문화생활");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Wrapper>
      {categories.map((category, index) => (
        <CategoryItem
          key={index}
          category={category}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      ))}
    </Wrapper>
  );
};

export default CategoryList;

// styled components

const Wrapper = styled.div`
    width: 372px;
    height: 30px;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    margin: 25px 0 0 18px;

    &::-webkit-scrollbar{
        display: none;
    }
`;

// categoryList
const categories = [
    "문화생활", "운동",
    "공구", "맛집탐방", "여행",
    "쇼핑", "택시", "스터디", "기타"
];
