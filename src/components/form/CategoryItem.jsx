import React from "react";
import styled from "styled-components";

const CategoryItem = ({ category, selectedCategory, onCategorySelect }) => {
    
    const handleClick = () => {
      onCategorySelect(category);
    };

    return (
      <Wrapper
        onClick={handleClick}
        $isSelected={selectedCategory === category}
      >
        {category}
      </Wrapper>
    );
};

export default CategoryItem;

// styled components

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    color: ${({$isSelected}) => ($isSelected ? 'white' : '#808284')};
    background-color: ${({$isSelected}) => ($isSelected ? 'black' : 'white')};
    border: 1px solid ${({$isSelected}) => ($isSelected ? 'black' : '#BCBEC0')};
    border-radius: 19.5px;
    margin-right: 10px;
    text-align: center;
    font-size: 12px;
    padding: 8px 20px;
    white-space: nowrap;

    transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;

    &:hover{
        cursor: pointer;
    }
`;