import React from 'react';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';

const HotPostListSkeleton = () => {
  return (
    <Wrapper>
      <PostBox/>
    </Wrapper>
  );
};

// 스켈레톤 레이아웃 구성

const PostBox = () => (
  <ContentLoader
  speed={2}
  width={390}
  height={185}
  viewBox="0 0 390 185"
  backgroundColor="#f3f3f3"
  foregroundColor="#ecebeb"
  >
    <rect x="15" y="15" rx="5" ry="5" width="136" height="185" />
    <rect x="164" y="15" rx="5" ry="5" width="136" height="185" />
    <rect x="313" y="15" rx="5" ry="5" width="136" height="185" />
  </ContentLoader>
);


// styled-components
const Wrapper = styled.div`
    width: 390px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
`;


export default HotPostListSkeleton;
