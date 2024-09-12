import styled from "styled-components";
import { selectedSortState } from "../../recoil/atoms";
import { useRecoilState } from "recoil";

const SortFilter = () => {
    const [sort, setSort] = useRecoilState(selectedSortState);

    const handleSortChange = (e) => {
        setSort(e.target.value);
    }

    return (
        <>
            <Wrapper>
                <Select value={sort} onChange={handleSortChange}>
                    <Option value="최신순">최신순</Option>
                    <Option value="시간임박순">시간임박순</Option>
                    <Option value="인원임박순">인원임박순</Option>
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
