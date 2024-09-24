import React from 'react';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';

const PostListSkeleton = () => {
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
        height={127}
        viewBox="0 0 390 127"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="10" y="10" rx="5" ry="5" width="96" height="96" />
        <rect x="120" y="20" rx="5" ry="5" width="70" height="20" />
        <rect x="120" y="50" rx="5" ry="5" width="200" height="20" />
        <rect x="120" y="80" rx="5" ry="5" width="50" height="15" />
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
`;


export default PostListSkeleton;
