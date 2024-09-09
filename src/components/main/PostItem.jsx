import styled from "styled-components";

const PostItem = ({post}) => {

    const deadLineDate = new Date(post.deadline);
    const leftDays = Math.ceil((deadLineDate-Date.now()) / (1000*60*60*24));

    return (
        <>
            <Wrapper>
                <Image></Image>
                <TextArea>
                    <Top>
                        <DayItem>D-{leftDays}</DayItem>
                        <CategoryItem>{post.category}</CategoryItem>
                        <TimeIndicator>{post.uploadAt}</TimeIndicator>
                    </Top>
                    <Middle>{post.title}</Middle>
                    <Bottom>
                        <Profile></Profile>
                        <Author>{post.author}</Author>
                    </Bottom>
                </TextArea>
            </Wrapper>
        </>
    );
}

export default PostItem;

// styled components

const Wrapper = styled.div`
    display: flex;
    padding: 15px 18px;
    border-bottom: 1px solid #F5F5F5;
    
    &:hover{
        background-color: #fcfcfc;
        cursor: pointer;
    }
`;

const Image = styled.img.attrs({
    
})`
    width: 96px;
    height: 96px;
    border-radius: 11px;
    background-color: lightgray;
`;

const TextArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-left: 18px;
`;

const Top = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 7px;
    height: 17px;
    white-space: nowrap;
`;

const DayItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 8px;
    font-weight: bold;
    color: white;
    padding: 0 9.5px 0 9.5px;
    border: 1px solid #7f52ff;
    border-radius: 19.5px;
    background-color: #7F52FF;
`;

const CategoryItem = styled.div`
    height: 100%;
    margin-left: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 8px;
    font-weight: bold;
    color: #404040;
    padding: 0 9.5px 0 9.5px;
    border: 1px solid #808264;
    border-radius: 19.5px;
`;

const TimeIndicator = styled.div`
    
`;

const Middle = styled.div`
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
`;

const Bottom = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-top: 14px;
`;

const Profile = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-color: gray;
    justify-content: flex-start;
`;

const Author = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: 7px;
    font-size: 12px;
    color: #404040;
`;
