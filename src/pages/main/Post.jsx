import React from "react";
import styled from "styled-components";

const Post = () => {
    return (
        <>
            <Wrapper>
                <section>
                    <button></button>
                </section>
                <Image className='photo'>
                    <img src="" alt="첨부한 사진" />
                </Image>
                <section>
                <h2>평양냉면 도장깨기 함께 하실 분</h2>
                <div>
                    <span>작성자</span> <span>고윤정</span> <span>프론트엔드/대면</span>
                </div>
                    <span>모집기간 24.09.05 17:00 ~ 24.09.09 18:00</span>
                </section>
                <div></div>
            </Wrapper>
        </>
    );
}

export default Post;

// styled components

const Wrapper = styled.div`
    
`;

const Image = styled.div`
  width: 326px;
  height: 326px;
  background-color: gray;
  border-radius: 11px;
`;

