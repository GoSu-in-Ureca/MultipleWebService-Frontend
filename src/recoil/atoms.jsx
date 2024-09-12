import { atom } from 'recoil';

// 메인페이지 정렬 기준
export const selectedSortState = atom({
  key: 'seledtedSortState',
  default: '최신순',
});

// 선택된 카테고리 상태 관리
export const selectedCategoryState = atom({
  key: 'selectedCategoryState',
  default: '전체',
});
