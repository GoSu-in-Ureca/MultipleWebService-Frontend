import React from 'react';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';

const PostSkeleton = () => {
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
  height={844}
  viewBox="0 0 390 844"
  backgroundColor="#f3f3f3"
  foregroundColor="#ecebeb"
  >
    <rect x="22" y="52" rx="15" ry="15" width="350" height="326" />
    <rect x="22" y="403" rx="5" ry="5" width="150" height="28" />
    <rect x="22" y="453" rx="5" ry="5" width="200" height="30" />
    <rect x="22" y="501" rx="5" ry="5" width="50" height="14" />
    <rect x="85" y="501" rx="5" ry="5" width="180" height="14" />
    <rect x="22" y="524" rx="5" ry="5" width="50" height="14" />
    <rect x="85" y="524" rx="5" ry="5" width="180" height="14" />
    <rect x="22" y="547" rx="5" ry="5" width="50" height="14" />
    <rect x="85" y="547" rx="5" ry="5" width="180" height="14" />
    <rect x="22" y="570" rx="5" ry="5" width="50" height="14" />
    <rect x="85" y="570" rx="5" ry="5" width="180" height="14" />
    <rect x="22" y="593" rx="5" ry="5" width="50" height="14" />
    <rect x="85" y="593" rx="5" ry="5" width="180" height="14" />
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


export default PostSkeleton;
