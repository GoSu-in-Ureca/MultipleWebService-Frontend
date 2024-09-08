import styled from "styled-components";
import heart from "/assets/Icon/heart.svg"

const HotPostItem = ({HotPost}) => {

    const deadLineDate = new Date(HotPost.deadline);
    const leftDays = Math.ceil((deadLineDate-Date.now()) / (1000*60*60*24));

    return (
        <>
            <Wrapper>
                <HeadArea>
                    <HeadItem>D-{leftDays}</HeadItem>
                    <HeadItem>{HotPost.category}</HeadItem>
                </HeadArea>
                <BottomArea>
                    <Interest>
                        <InterestIcon />
                        <InterestCount>{HotPost.interests}</InterestCount>
                    </Interest>
                    <Title>{HotPost.title}</Title>
                    <AuthorArea>
                        <AuthorProfile />
                        <AuthorName>{HotPost.author}</AuthorName>
                    </AuthorArea>
                </BottomArea>
            </Wrapper>
        </>
    );
}

export default HotPostItem;

// styled components

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    min-width: 136px;
    padding: 12px;
    border-radius: 11px;
    background-color: black;
    margin-right: 13px;
    white-space: nowrap;

    &:hover{
        cursor: pointer;
    }
`;

const HeadArea = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
`;

const HeadItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px white solid;
    border-radius: 19.5px;
    font-size: 8px;
    color: white;
    background-color: rgba(255, 255, 255, 0.5);
    margin-right: 6px;
    padding: 3.5px 9px;
`;

const BottomArea = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
`;

const Interest = styled.div`
    display: flex;
    justify-content: flex-start;
`

const InterestIcon = styled.img.attrs({
    src: heart,
    alt: "Heart Icon"
})`
    width: 10px;
    height: 10px;
`;

const InterestCount = styled.div`
    font-size: 8px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1px;
`;

const Title = styled.div`
    font-size: 14px;
    color: white;
    max-width: 120px;
    white-space: pre-wrap;
    margin-top: 5px;
`;

const AuthorArea = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
`;

const AuthorProfile = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background-color: gray;
`;

const AuthorName = styled.div`
    height: 20px;
    font-size: 11px;
    color: white;
    display: flex;
    justify-content: flex-start;
    /* align-items: center; */
    margin-left: 7px;
`;
