import React from 'react';
import styled from 'styled-components';
import ContentLoader from 'react-content-loader';

const UserSkeleton = () => {
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
    <rect x="67" y="84" rx="40" ry="40" width="67" height="67" />
    <rect x="59" y="163" rx="5" ry="5" width="83" height="12" />
    <rect x="75" y="190" rx="5" ry="5" width="52" height="24" />
    <rect x="69" y="218" rx="5" ry="5" width="64" height="12" />
    <rect x="70" y="246" rx="5" ry="5" width="62" height="22" />
    
    <rect x="223" y="84" rx="5" ry="5" width="45" height="14" />
    <rect x="226" y="106" rx="5" ry="5" width="39" height="24" />
    <rect x="296" y="84" rx="5" ry="5" width="45" height="14" />
    <rect x="300" y="106" rx="5" ry="5" width="39" height="24" />

    <rect x="223" y="164" rx="5" ry="5" width="57" height="14" />
    <rect x="226" y="186" rx="5" ry="5" width="115" height="86" />
    {/* <rect x="23" y="340" rx="5" ry="5" width="105" height="19" />
    <rect x="23" y="467" rx="5" ry="5" width="105" height="19" /> */}
    
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


export default UserSkeleton;
