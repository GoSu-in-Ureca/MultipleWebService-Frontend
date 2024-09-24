import React from 'react';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';

const UserInterestSkeleton = () => {
  return (
    <Wrapper>
      <PostBox/>
    </Wrapper>
  );
};

// 스켈레톤 레이아웃 구성

const PostBox = () => (
  <>
    {new Array(10).fill('').map((_, i) => (
      <ContentLoader
        key={i}
        speed={2}
        width={390}
        height={102}
        viewBox="0 0 390 102"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="22" y="16" rx="5" ry="5" width="70" height="70" />
        <rect x="106" y="21" rx="5" ry="5" width="240" height="18" />
        <rect x="106" y="45" rx="5" ry="5" width="147" height="12" />
        <rect x="106" y="66" rx="5" ry="5" width="145" height="12" />
      </ContentLoader>
    ))}
  </>
);


// styled-components
const Wrapper = styled.div`
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    padding-top: 52px;
`;


export default UserInterestSkeleton;