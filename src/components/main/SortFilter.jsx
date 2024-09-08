import styled from "styled-components";

const SortFilter = () => {
    return (
        <>
            <Wrapper>
                <Select>
                    <Option value="">최신순</Option>
                    <Option value="">시간임박순</Option>
                    <Option value="">인원임박순</Option>
                </Select>
            </Wrapper>
        </>
    );
}

export default SortFilter;

// styled components

const Wrapper = styled.div`
    margin-right: 16px;
`;

const Select = styled.select`
    border: none;
    outline: none;
`;

const Option = styled.option`
    font-size: 12px;
    text-align: center;
`;
